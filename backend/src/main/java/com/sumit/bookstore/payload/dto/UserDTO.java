package com.sumit.bookstore.payload.dto;

import com.sumit.bookstore.domain.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    @NotNull(message ="Email is required")
    private String email;

    @NotNull(message = "Password is required")
    private String password;

    private String phone;

    @NotNull(message = "FullName is required")
    private String fullName;

    private UserRole role;

    private String userName;

    private LocalDateTime lastLogin;


}
