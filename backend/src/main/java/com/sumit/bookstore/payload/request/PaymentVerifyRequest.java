package com.sumit.bookstore.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentVerifyRequest {

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private String razorpaySignature;

    // Stripe specific fields
    private String stripePaymentIntentId;

    private String stripePaymentIntentStatus;
}
