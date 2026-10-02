package com.sumit.bookstore.service;

import com.sumit.bookstore.payload.dto.PaymentDTO;
import com.sumit.bookstore.payload.request.PaymentInitiateRequest;
import com.sumit.bookstore.payload.request.PaymentVerifyRequest;
import com.sumit.bookstore.payload.response.PaymentInitiateResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IPaymentService {

    PaymentInitiateResponse initiatePayment(PaymentInitiateRequest req) throws Exception;

    PaymentDTO verifyPayment(PaymentVerifyRequest req) throws Exception;

    Page<PaymentDTO> getAllPayments(Pageable pageable);
}