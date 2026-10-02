package com.sumit.bookstore.mapper;

import com.sumit.bookstore.exception.SubscriptionException;
import com.sumit.bookstore.model.Subscription;
import com.sumit.bookstore.model.SubscriptionPlan;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.SubscriptionDTO;
import com.sumit.bookstore.repository.ISubscriptionPlanRepo;
import com.sumit.bookstore.repository.IUserRepo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class SubscriptionMapper {

    private final IUserRepo userRepository;
    private final ISubscriptionPlanRepo planRepository;


    /**
     * Convert Subscription entity to DTO
     */
    public SubscriptionDTO toDTO(Subscription subscription) {

        if (subscription == null) {
            return null;
        }

        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(subscription.getId());


        // User information
        if (subscription.getUser() != null) {

            dto.setUserId(subscription.getUser().getId());
            dto.setUserName(subscription.getUser().getFullName());
            dto.setUserEmail(subscription.getUser().getEmail());
        }


        // Plan information
        if (subscription.getPlan() != null) {
            dto.setPlanId(subscription.getPlan().getId());
        }

        dto.setPlanName(subscription.getPlanName());
        dto.setPlanCode(subscription.getPlanCode());
        dto.setPrice(subscription.getPrice());
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setIsActive(subscription.getIsActive());
        dto.setMaxBooksAllowed(subscription.getMaxBooksAllowed());
        dto.setMaxDaysPerBook(subscription.getMaxDaysPerBook());
        dto.setAutoRenew(subscription.getAutoRenew());
        dto.setCancelledAt(subscription.getCancelledAt());
        dto.setCancellationReason(subscription.getCancellationReason());
        dto.setNotes(subscription.getNotes());
        dto.setCreatedAt(subscription.getCreatedAt());
        dto.setUpdatedAt(subscription.getUpdatedAt());

        // Calculated fields
        dto.setDaysRemaining(subscription.getDaysRemaining());
        dto.setIsValid(subscription.isValid());
        dto.setIsExpired(subscription.isExpired());

        return dto;
    }


    /**
     * Convert DTO to Subscription entity
     */
    public Subscription toEntity(SubscriptionDTO dto, SubscriptionPlan plan, User user)
            throws SubscriptionException {

        if (dto == null) {
            return null;
        }

        Subscription subscription = new Subscription();
        subscription.setId(dto.getId());
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setNotes(dto.getNotes());

        return subscription;
    }


    /**
     * Convert list of subscriptions to DTOs
     */
    public List<SubscriptionDTO> toDTOList(
            List<Subscription> subscriptions) {

        if (subscriptions == null) {
            return null;
        }

        return subscriptions.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
