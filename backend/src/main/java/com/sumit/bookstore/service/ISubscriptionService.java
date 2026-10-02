package com.sumit.bookstore.service;

import com.sumit.bookstore.exception.SubscriptionException;
import com.sumit.bookstore.model.Subscription;
import com.sumit.bookstore.payload.dto.SubscriptionDTO;

import com.sumit.bookstore.payload.response.PaymentInitiateResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ISubscriptionService {

    PaymentInitiateResponse subscribe(SubscriptionDTO subscriptionDTO) throws Exception;

    SubscriptionDTO getUsersActiveSubscription(Long userId) throws Exception;

    SubscriptionDTO cancelSubscription(Long subscriptionId, String reason) throws SubscriptionException;

    SubscriptionDTO activeSubscription(Long subscriptionId, Long paymentId) throws SubscriptionException;

    List<SubscriptionDTO> getAllSubscriptions(Pageable pageable);

    void deactivateExpiredSubscriptions() throws Exception;


}
