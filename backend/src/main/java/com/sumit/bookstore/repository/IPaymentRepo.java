package com.sumit.bookstore.repository;

import com.sumit.bookstore.model.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IPaymentRepo
        extends JpaRepository<Payment, Long> {
}
