package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.PaymentGateway;
import com.sumit.bookstore.domain.PaymentStatus;
import com.sumit.bookstore.mapper.PaymentMapper;
import com.sumit.bookstore.model.Payment;
import com.sumit.bookstore.model.Subscription;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.PaymentDTO;
import com.sumit.bookstore.payload.request.PaymentInitiateRequest;
import com.sumit.bookstore.payload.request.PaymentVerifyRequest;
import com.sumit.bookstore.payload.response.PaymentInitiateResponse;
import com.sumit.bookstore.payload.response.PaymentLinkResponse;
import com.sumit.bookstore.repository.IPaymentRepo;
import com.sumit.bookstore.repository.ISubscriptionRepo;
import com.sumit.bookstore.repository.IUserRepo;
import com.sumit.bookstore.service.IPaymentService;
import com.sumit.bookstore.service.gateway.RazorpayService;
import com.sumit.bookstore.event.PaymentEventPublisher;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {

    private final IUserRepo userRepository;
    private final IPaymentRepo paymentRepository;
    private final ISubscriptionRepo subscriptionRepository;
    private final RazorpayService razorpayService;
    private final PaymentMapper paymentMapper;
    private final PaymentEventPublisher paymentEventPublisher;

    @Override
    public PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) throws Exception {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Exception("User not found with id: " + request.getUserId()));

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPaymentType(request.getPaymentType());
        payment.setGateway(request.getPaymentGateway());
        payment.setAmount(request.getAmount());
        payment.setDescription(request.getDescription());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId("TXN_" + UUID.randomUUID());
        payment.setInitiatedAt(LocalDateTime.now());
        payment.setFineId(request.getFineId());

        if (request.getSubscriptionId() != null) {
            Subscription sub = subscriptionRepository
                    .findById(request.getSubscriptionId())
                    .orElseThrow(() -> new Exception("Subscription not found"));
            payment.setSubscription(sub);
        }

        payment = paymentRepository.save(payment);

        if (request.getPaymentGateway() != PaymentGateway.RAZORPAY) {
            throw new IllegalArgumentException("Unsupported payment gateway: " + request.getPaymentGateway());
        }

        PaymentLinkResponse paymentLinkResponse = razorpayService.createPaymentLink(user, payment);

        return PaymentInitiateResponse.builder()
                .paymentId(payment.getId())
                .gateway(payment.getGateway())
                .checkoutUrl(paymentLinkResponse.getPayment_link_url())
                .transactionId(paymentLinkResponse.getPayment_link_id())
                .amount(payment.getAmount())
                .description(payment.getDescription())
                .success(true)
                .message("Payment initiated successfully")
                .build();
    }

    @Override
    public PaymentDTO verifyPayment(PaymentVerifyRequest req) throws Exception {
        if (req.getRazorpayPaymentId() == null || req.getRazorpayPaymentId().isBlank()) {
            throw new IllegalArgumentException("Razorpay payment id is required");
        }

        JSONObject paymentDetails = razorpayService.fetchPaymentDetails(req.getRazorpayPaymentId());
        JSONObject notes = paymentDetails.optJSONObject("notes");

        if (notes == null || !notes.has("payment_id")) {
            throw new Exception("Payment metadata is missing");
        }

        long paymentId = notes.getLong("payment_id");
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new Exception("Payment not found"));

        String currentEmail = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        boolean admin = SecurityContextHolder.getContext().getAuthentication() != null
                && SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));

        if (!admin && currentEmail != null
                && !payment.getUser().getEmail().equalsIgnoreCase(currentEmail)) {
            throw new SecurityException("You cannot verify another user's payment");
        }

        if (payment.getGateway() != PaymentGateway.RAZORPAY) {
            throw new IllegalArgumentException("Payment gateway mismatch");
        }

        boolean valid = razorpayService.isValidPayment(paymentDetails, payment);
        if (!valid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Razorpay payment validation failed");
            paymentRepository.save(payment);
            throw new IllegalArgumentException("Payment validation failed");
        }

        boolean newlySuccessful = payment.getStatus() != PaymentStatus.SUCCESS;

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setGatewayPaymentId(req.getRazorpayPaymentId());
        payment.setGatewayOrderId(req.getRazorpayOrderId());
        payment.setGatewaySignature(req.getRazorpaySignature());
        payment.setCompletedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        if (newlySuccessful) {
            paymentEventPublisher.publishPaymentSuccess(payment);
        }

        return paymentMapper.toDTO(payment);
    }

    @Override
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(paymentMapper::toDTO);
    }
}
