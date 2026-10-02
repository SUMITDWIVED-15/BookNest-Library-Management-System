package com.sumit.bookstore.service;

import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.UserDTO;

import java.util.List;

public interface IUserService {

    public User getCurrentUser() throws Exception;

    public List<UserDTO> getAllUsers() throws Exception;

    User findById(Long id) throws Exception;

}
