package com.sumit.bookstore.service.gateway;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sumit.bookstore.domain.PaymentType;
import com.sumit.bookstore.model.Payment;
import com.sumit.bookstore.model.SubscriptionPlan;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.response.PaymentLinkResponse;
import com.sumit.bookstore.service.ISubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.callback.base-url:http://localhost:8080/api/payments/callback}")
    private String callbackBaseUrl;

    private final ISubscriptionPlanService subscriptionPlanService;

    public PaymentLinkResponse createPaymentLink(User user, Payment payment) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(
                    razorpayKeyId,
                    razorpayKeySecret
            );

            long amountInPaise = payment.getAmount() * 100L;

            JSONObject request = new JSONObject();
            request.put("amount", amountInPaise);
            request.put("currency", "INR");
            request.put("description", payment.getDescription());

            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullName());
            customer.put("email", user.getEmail());
            if (user.getPhone() != null && !user.getPhone().isBlank()) {
                customer.put("contact", user.getPhone());
            }
            request.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("email", true);
            notify.put("sms", user.getPhone() != null && !user.getPhone().isBlank());
            request.put("notify", notify);
            request.put("reminder_enable", true);

            JSONObject callback = new JSONObject();
            callback.put("callback_url", callbackBaseUrl);
            callback.put("callback_method", "get");
            request.put("callback_url", callback.getString("callback_url"));
            request.put("callback_method", callback.getString("callback_method"));

            JSONObject notes = new JSONObject();
            notes.put("payment_id", payment.getId());
            notes.put("user_id", user.getId());
            notes.put("payment_type", payment.getPaymentType().name());

            if (payment.getPaymentType() == PaymentType.MEMBERSHIP
                    && payment.getSubscription() != null) {
                notes.put("subscription_id", payment.getSubscription().getId());
                notes.put("plan", payment.getSubscription().getPlanCode());
            }

            if (payment.getPaymentType() == PaymentType.FINE
                    && payment.getFineId() != null) {
                notes.put("fine_id", payment.getFineId());
            }

            request.put("notes", notes);

            var paymentLink = razorpayClient.paymentLink.create(request);

            PaymentLinkResponse response = new PaymentLinkResponse();
            response.setPayment_link_url(paymentLink.get("short_url"));
            response.setPayment_link_id(paymentLink.get("id"));
            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay payment link: " + e.getMessage(), e);
        }
    }

    public JSONObject fetchPaymentDetails(String paymentId) throws Exception {
        try {
            RazorpayClient razorpay = new RazorpayClient(
                    razorpayKeyId,
                    razorpayKeySecret
            );
            return razorpay.payments.fetch(paymentId).toJson();
        } catch (RazorpayException e) {
            throw new Exception("Failed to fetch Razorpay payment details: " + e.getMessage(), e);
        }
    }

    public boolean isValidPayment(JSONObject paymentDetails, Payment payment) {
        try {
            String status = paymentDetails.optString("status");
            if (!"captured".equalsIgnoreCase(status)) {
                return false;
            }

            long amountInPaise = paymentDetails.getLong("amount");
            long expectedAmountInPaise = payment.getAmount() * 100L;
            if (amountInPaise != expectedAmountInPaise) {
                return false;
            }

            JSONObject notes = paymentDetails.optJSONObject("notes");
            if (notes == null) {
                return false;
            }

            if (notes.optLong("payment_id", -1L) != payment.getId()) {
                return false;
            }

            if (notes.optLong("user_id", -1L) != payment.getUser().getId()) {
                return false;
            }

            String paymentType = notes.optString("payment_type");
            if (!payment.getPaymentType().name().equalsIgnoreCase(paymentType)) {
                return false;
            }

            if (payment.getPaymentType() == PaymentType.MEMBERSHIP) {
                if (payment.getSubscription() == null) {
                    return false;
                }

                String planCode = notes.optString("plan");
                SubscriptionPlan plan = subscriptionPlanService
                        .getBySubscriptionPlanCode(planCode);

                return plan != null
                        && plan.getPrice().equals(payment.getAmount())
                        && payment.getSubscription().getId()
                        .equals(notes.optLong("subscription_id", -1L));
            }

            if (payment.getPaymentType() == PaymentType.FINE) {
                return payment.getFineId() != null
                        && payment.getFineId().equals(
                        notes.optLong("fine_id", -1L));
            }

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
