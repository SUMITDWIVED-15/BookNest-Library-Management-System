package com.sumit.bookstore.event;

import com.sumit.bookstore.model.Payment;

import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public void publishPaymentSuccess(Payment payment) {

        applicationEventPublisher.publishEvent(payment);
    }
}
