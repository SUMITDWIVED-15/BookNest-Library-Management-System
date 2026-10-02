package com.sumit.bookstore.service;

import com.sumit.bookstore.exception.UserException;
import com.sumit.bookstore.payload.dto.UserDTO;
import com.sumit.bookstore.payload.response.AuthResponse;

public interface IAuthService {

    AuthResponse login(String username, String password) throws UserException;

    AuthResponse signup(UserDTO req) throws UserException;

    void createPasswordResetToken(String email) throws UserException;

    void resetPassword(String token, String newPassword) throws Exception;
}
