package com.sumit.bookstore.event;

import com.sumit.bookstore.exception.SubscriptionException;
import com.sumit.bookstore.model.Payment;
import com.sumit.bookstore.service.IFineService;
import com.sumit.bookstore.service.ISubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PaymentEventListener {

    private final ISubscriptionService subscriptionService;
    private final IFineService fineService;

    @EventListener
    @Transactional
    public void handlePaymentSuccess(Payment payment) throws SubscriptionException {
        if (payment == null || payment.getPaymentType() == null) {
            return;
        }

        switch (payment.getPaymentType()) {
            case MEMBERSHIP -> {
                if (payment.getSubscription() != null) {
                    subscriptionService.activeSubscription(
                            payment.getSubscription().getId(),
                            payment.getId()
                    );
                }
            }
            case FINE -> {
                if (payment.getFineId() != null) {
                    fineService.markFineAsPaid(
                            payment.getFineId(),
                            payment.getAmount(),
                            payment.getGatewayPaymentId()
                    );
                }
            }
            case LOST_BOOK_PENALTY, DAMAGED_BOOK_PENALTY, REFUND -> {
                // No additional domain transition is currently implemented.
            }
        }
    }
}
