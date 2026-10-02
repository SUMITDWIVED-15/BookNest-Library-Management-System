package com.sumit.bookstore.repository;

import com.sumit.bookstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepo extends JpaRepository<User,Long> {

    User findByEmail(String email);

}
