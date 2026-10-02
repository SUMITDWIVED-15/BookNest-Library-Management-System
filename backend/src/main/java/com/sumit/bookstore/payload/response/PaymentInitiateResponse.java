package com.sumit.bookstore.payload.response;

import com.sumit.bookstore.domain.PaymentGateway;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentInitiateResponse {

    private Long paymentId;

    private PaymentGateway gateway;

    private String transactionId;

    private String razorpayOrderId;

    private Long amount;

    private String checkoutUrl;

    private String description;

    private String message;

    private Boolean success;
}
