package com.sumit.bookstore.controller;

import com.sumit.bookstore.payload.dto.PaymentDTO;
import com.sumit.bookstore.payload.request.PaymentVerifyRequest;
import com.sumit.bookstore.payload.response.ApiResponse;
import com.sumit.bookstore.service.IPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final IPaymentService paymentService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        try {
            PaymentDTO payment = paymentService.verifyPayment(request);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> paymentCallback(
            @RequestParam(name = "razorpay_payment_id", required = false) String paymentId,
            @RequestParam(name = "razorpay_payment_link_id", required = false) String paymentLinkId,
            @RequestParam(name = "razorpay_payment_link_reference_id", required = false) String paymentLinkReferenceId,
            @RequestParam(name = "razorpay_signature", required = false) String signature) {

        try {
            if (paymentId == null || paymentId.isBlank()) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(frontendUrl + "/subscription?payment=failed"))
                        .build();
            }

            PaymentVerifyRequest request = new PaymentVerifyRequest(
                    paymentId,
                    paymentLinkId,
                    signature,
                    null,
                    null
            );

            paymentService.verifyPayment(request);

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(frontendUrl + "/subscription?payment=success"))
                    .build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(frontendUrl + "/subscription?payment=failed"))
                    .build();
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PaymentDTO> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(payments);
    }
}
