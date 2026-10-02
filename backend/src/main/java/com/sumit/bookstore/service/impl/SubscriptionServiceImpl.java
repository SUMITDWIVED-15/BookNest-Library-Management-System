package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.PaymentGateway;
import com.sumit.bookstore.domain.PaymentType;
import com.sumit.bookstore.exception.SubscriptionException;
import com.sumit.bookstore.mapper.SubscriptionMapper;
import com.sumit.bookstore.model.Subscription;
import com.sumit.bookstore.model.SubscriptionPlan;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.SubscriptionDTO;

import com.sumit.bookstore.payload.request.PaymentInitiateRequest;
import com.sumit.bookstore.payload.response.PaymentInitiateResponse;
import com.sumit.bookstore.repository.ISubscriptionPlanRepo;
import com.sumit.bookstore.repository.ISubscriptionRepo;
import com.sumit.bookstore.service.IPaymentService;
import com.sumit.bookstore.service.ISubscriptionService;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements ISubscriptionService {

    private final ISubscriptionRepo subscriptionRepository;

    private final SubscriptionMapper subscriptionMapper;

    private final IUserService userService;

    private final ISubscriptionPlanRepo subscriptionPlanRepository;

    private final IPaymentService paymentService;


    @Override
    public PaymentInitiateResponse subscribe(SubscriptionDTO subscriptionDTO)
            throws Exception {
        User user = userService.getCurrentUser();

        SubscriptionPlan plan = subscriptionPlanRepository.findById(subscriptionDTO.getPlanId())
                .orElseThrow(() -> new Exception("Plan not found!"));

        Subscription subscription = subscriptionMapper.toEntity(subscriptionDTO, plan, user);
        subscription.initializeFromPlan();
        subscription.setIsActive(false);
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        PaymentInitiateRequest paymentInitiateRequest = PaymentInitiateRequest.builder()
                .userId(user.getId())
                .subscriptionId(subscription.getId())
                .paymentType(PaymentType.MEMBERSHIP)
                .paymentGateway(PaymentGateway.RAZORPAY)
                .amount(subscription.getPrice())
                .description("Library Subscription - " + plan.getName())
                .build();

        return paymentService.initiatePayment(paymentInitiateRequest);
    }


    @Override
    public SubscriptionDTO getUsersActiveSubscription(Long userId) throws Exception {
        User user = userService.getCurrentUser();

        Subscription subscription = subscriptionRepository
                .findActiveSubscriptionByUserId(user.getId(), LocalDate.now())
                .orElseThrow(() -> new SubscriptionException("no active subscription found!"));

        return subscriptionMapper.toDTO(subscription);
    }


    @Override
    public SubscriptionDTO cancelSubscription(Long subscriptionId, String reason)
            throws SubscriptionException {

        Subscription subscription = subscriptionRepository
                .findById(subscriptionId)
                .orElseThrow(() -> new SubscriptionException("Subscription not found with ID: " + subscriptionId));

        if (!subscription.getIsActive()) {
            throw new SubscriptionException("Subscription is already inactive");
        }

        // Mark as canceled
        subscription.setIsActive(false);
        subscription.setCancelledAt(LocalDateTime.now());
        subscription.setCancellationReason(reason != null ? reason : "Cancelled by user");

        subscription = subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }


    @Override
    public SubscriptionDTO activeSubscription(Long subscriptionId, Long paymentId)
            throws SubscriptionException {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new SubscriptionException("subscription not found by id!"));

        // verify payment (todo)

        subscription.setIsActive(true);
        subscription = subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }


    @Override
    public List<SubscriptionDTO> getAllSubscriptions(Pageable pageable) {
        List<Subscription> subscriptions = subscriptionRepository.findAll();

        return subscriptionMapper.toDTOList(subscriptions);
    }


    @Override
    public void deactivateExpiredSubscriptions() throws Exception {

        List<Subscription> expiredSubscriptions = subscriptionRepository
                .findExpiredActiveSubscriptions(LocalDate.now());

        for (Subscription subscription : expiredSubscriptions) {
            subscription.setIsActive(false);
            subscriptionRepository.save(subscription);
        }
    }
}
