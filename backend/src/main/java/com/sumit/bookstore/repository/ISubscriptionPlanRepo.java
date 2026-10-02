package com.sumit.bookstore.repository;

import com.sumit.bookstore.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISubscriptionPlanRepo extends JpaRepository<SubscriptionPlan,Long> {

    Boolean existsByPlanCode(String planCode);

    SubscriptionPlan findByPlanCode(String planCode);

}
