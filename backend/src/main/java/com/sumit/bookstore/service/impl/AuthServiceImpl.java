package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.configurations.JwtProvider;
import com.sumit.bookstore.domain.UserRole;
import com.sumit.bookstore.exception.UserException;
import com.sumit.bookstore.mapper.UserMapper;
import com.sumit.bookstore.model.PasswordResetToken;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.UserDTO;
import com.sumit.bookstore.payload.response.AuthResponse;
import com.sumit.bookstore.repository.IPasswordResetTokenRepo;
import com.sumit.bookstore.repository.IUserRepo;
import com.sumit.bookstore.service.IAuthService;
import com.sumit.bookstore.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final IUserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserServiceImpl customUserServiceImplementation;
    private final IPasswordResetTokenRepo passwordResetTokenRepository;
    private final IEmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public AuthResponse login(String username, String password) throws UserException {
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);
        User user = userRepository.findByEmail(username);

        if (user == null) {
            throw new UserException("user not found with email - " + username);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setTitle("Login success");
        response.setMessage("Welcome Back " + user.getFullName());
        response.setJwt(token);
        response.setUser(UserMapper.toDTO(user));
        return response;
    }

    private Authentication authenticate(String username, String password) throws UserException {
        UserDetails userDetails = customUserServiceImplementation.loadUserByUsername(username);

        if (userDetails == null) {
            throw new UserException("user not found with email - " + username);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("password not match");
        }

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                userDetails.getAuthorities()
        );
    }

    @Override
    public AuthResponse signup(UserDTO req) throws UserException {
        User existingUser = userRepository.findByEmail(req.getEmail());

        if (existingUser != null) {
            throw new UserException("email id already registered");
        }

        User createdUser = new User();
        createdUser.setEmail(req.getEmail());
        createdUser.setPassword(passwordEncoder.encode(req.getPassword()));
        createdUser.setPhone(req.getPhone());
        createdUser.setFullName(req.getFullName());
        createdUser.setLastLogin(LocalDateTime.now());
        createdUser.setRole(UserRole.ROLE_USER);

        User savedUser = userRepository.save(createdUser);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                null,
                customUserServiceImplementation
                        .loadUserByUsername(savedUser.getEmail())
                        .getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = jwtProvider.generateToken(auth);

        AuthResponse response = new AuthResponse();
        response.setJwt(jwt);
        response.setTitle("Welcome " + createdUser.getFullName());
        response.setMessage("register success");
        response.setUser(UserMapper.toDTO(savedUser));
        return response;
    }

    @Transactional
    public void createPasswordResetToken(String email) throws UserException {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("user not found with given email");
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String subject = "BookNest Password Reset Request";
        String body = "<p>You requested to reset your BookNest password.</p>"
                + "<p>Use this link within 15 minutes:</p>"
                + "<p><a href=\"" + resetLink + "\">Reset Password</a></p>"
                + "<p>If you did not request this, you can ignore this email.</p>";

        emailService.sendEmail(user.getEmail(), subject, body);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) throws Exception {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new Exception("token not valid"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new Exception("token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }
}
