package com.sumit.bookstore.controller;

import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.UserDTO;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.annotation.Target;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    public final IUserService userService;

    //Provide List of all Users from DataBase
    @GetMapping(("/list"))
    public ResponseEntity<List<UserDTO>> getAllUsers() throws Exception{
        return ResponseEntity.ok(userService.getAllUsers());
    }

    //Provide Profile of Active/current User
    @GetMapping(("/profile"))
    public ResponseEntity<User> getUserProfile() throws Exception{
        return ResponseEntity.ok(userService.getCurrentUser());
    }



}
