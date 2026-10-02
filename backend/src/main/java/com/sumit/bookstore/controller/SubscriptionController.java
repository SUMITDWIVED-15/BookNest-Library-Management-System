package com.sumit.bookstore.controller;

import com.sumit.bookstore.exception.SubscriptionException;
import com.sumit.bookstore.payload.dto.SubscriptionDTO;

import com.sumit.bookstore.payload.response.ApiResponse;
import com.sumit.bookstore.payload.response.PaymentInitiateResponse;
import com.sumit.bookstore.service.ISubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final ISubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(
            @Valid @RequestBody SubscriptionDTO subscription)
            throws Exception {

        PaymentInitiateResponse response = subscriptionService.subscribe(subscription);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/user/active")
    public ResponseEntity<?> getUsersActiveSubscription(
            @RequestParam(required = false) Long userId) throws Exception {

        SubscriptionDTO dto = subscriptionService.getUsersActiveSubscription(userId);
        return ResponseEntity.ok(dto);
    }


    @GetMapping("/admin")
    public ResponseEntity<?> getAllSubscriptions() {
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size);
        List<SubscriptionDTO> dtoList = subscriptionService.getAllSubscriptions(pageable);

        return ResponseEntity.ok(dtoList);
    }


    @GetMapping("/admin/deactivate-expired")
    public ResponseEntity<?> deactivateExpiredSubscriptions()
            throws Exception {
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size);
        subscriptionService.deactivateExpiredSubscriptions();

        ApiResponse res = new ApiResponse("task done!", true);
        return ResponseEntity.ok(res);
    }


    @PostMapping("/cancel/{subscriptionId}")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long subscriptionId,
            @RequestParam(required = false) String reason) throws SubscriptionException {

        SubscriptionDTO subscription = subscriptionService
                .cancelSubscription(subscriptionId, reason);
        return ResponseEntity.ok(subscription);
    }


    @PostMapping("/activate")
    public ResponseEntity<?> activateSubscription(
            @RequestParam Long subscriptionId,
            @RequestParam Long paymentId) throws SubscriptionException {

        SubscriptionDTO subscription = subscriptionService
                .activeSubscription(subscriptionId, paymentId);
        return ResponseEntity.ok(subscription);
    }
}
