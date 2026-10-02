package com.sumit.bookstore.controller;

import com.sumit.bookstore.exception.UserException;
import com.sumit.bookstore.payload.dto.UserDTO;
import com.sumit.bookstore.payload.request.ForgotPasswordRequest;
import com.sumit.bookstore.payload.request.LoginRequest;
import com.sumit.bookstore.payload.request.ResetPasswordRequest;
import com.sumit.bookstore.payload.response.ApiResponse;
import com.sumit.bookstore.payload.response.AuthResponse;
import com.sumit.bookstore.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(@RequestBody @Valid UserDTO req)
    throws UserException {
        AuthResponse res = authService.signup(req);
        return ResponseEntity.ok(res);

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody @Valid LoginRequest req)
            throws UserException {
        AuthResponse res = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(res);

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword
            (@RequestBody @Valid ForgotPasswordRequest request) throws UserException {
        authService.createPasswordResetToken(request.getEmail());
        ApiResponse res = new ApiResponse(
                "A Reset link was sent to you email.",true);
        return ResponseEntity.ok(res);

    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> restPassword(
            @RequestBody @Valid ResetPasswordRequest request) throws UserException, Exception {
        authService.resetPassword(request.getToken(),request.getPassword());
        ApiResponse res = new ApiResponse(
                "Password reset successful",true);
        return ResponseEntity.ok(res);

    }








}
