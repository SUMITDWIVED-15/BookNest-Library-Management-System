package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.UserRole;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.repository.IUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {

    private final IUserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.full-name:BookNest Administrator}")
    private String adminFullName;

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {

        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {
            throw new IllegalStateException(
                    "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD."
            );
        }

        if (userRepo.findByEmail(adminEmail) == null) {
            User user = User.builder()
                    .password(passwordEncoder.encode(adminPassword))
                    .email(adminEmail)
                    .fullName(adminFullName)
                    .role(UserRole.ROLE_ADMIN)
                    .build();

            userRepo.save(user);
        }
    }
}
