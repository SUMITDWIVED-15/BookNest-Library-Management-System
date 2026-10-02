package com.sumit.bookstore.service;


import com.sumit.bookstore.model.SubscriptionPlan;
import com.sumit.bookstore.payload.dto.SubscriptionPlanDTO;

import java.util.List;

public interface ISubscriptionPlanService {

    SubscriptionPlanDTO createSubscriptionPlan(
            SubscriptionPlanDTO planDTO) throws Exception;

    SubscriptionPlanDTO updateSubscriptionPlan(Long planId,
            SubscriptionPlanDTO planDTO) throws Exception;

    void deleteSubscriptionPlan(Long planId) throws Exception;

    List<SubscriptionPlanDTO> getAllSubscriptionPlan();

    SubscriptionPlan getBySubscriptionPlanCode(
            String subscriptionPlanCode) throws Exception;
}
