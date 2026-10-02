package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.mapper.UserMapper;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.UserDTO;
import com.sumit.bookstore.repository.IUserRepo;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    public final IUserRepo userRepo;
    private final UserMapper userMapper;

    @Override
    public User getCurrentUser() throws Exception{

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email);
        if(user==null){
            throw new Exception("User not found!");
        }
        return user;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepo.findAll();
        return users.stream()
                .map(UserMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public User findById(Long id) throws Exception {

        return userRepo.findById(id)
                .orElseThrow(() -> new Exception("User not found with given id!"));
    }
}
