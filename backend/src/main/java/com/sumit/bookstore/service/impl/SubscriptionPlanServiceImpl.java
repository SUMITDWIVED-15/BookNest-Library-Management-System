package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.mapper.SubscriptionPlanMapper;
import com.sumit.bookstore.model.SubscriptionPlan;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.SubscriptionPlanDTO;
import com.sumit.bookstore.repository.ISubscriptionPlanRepo;
import com.sumit.bookstore.service.ISubscriptionPlanService;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements ISubscriptionPlanService {

    private final ISubscriptionPlanRepo planRepository;

    private final SubscriptionPlanMapper planMapper;

    private final IUserService userService;

    @Override
    public SubscriptionPlanDTO createSubscriptionPlan(SubscriptionPlanDTO planDTO)
            throws Exception {
        if (planRepository.existsByPlanCode(planDTO.getPlanCode())) {
            throw new Exception("plan code is already exist");
        }

        SubscriptionPlan plan = planMapper.toEntity(planDTO);
        User currentUser = userService.getCurrentUser();
        plan.setCreatedBy(currentUser.getFullName());
        plan.setUpdatedBy(currentUser.getFullName());
        SubscriptionPlan savedPlan = planRepository.save(plan);

        return planMapper.toDTO(savedPlan);
    }

    @Override
    public SubscriptionPlanDTO updateSubscriptionPlan(Long planId,
            SubscriptionPlanDTO planDTO) throws Exception {

        SubscriptionPlan existingPlan = planRepository.findById(planId)
                        .orElseThrow(() -> new Exception("Plan not found!"));

        planMapper.updateEntity(existingPlan, planDTO);
        User currentUser = userService.getCurrentUser();
        existingPlan.setUpdatedBy(currentUser.getFullName());
        SubscriptionPlan updatedPlan = planRepository.save(existingPlan);

        return planMapper.toDTO(updatedPlan);
    }

    @Override
    public void deleteSubscriptionPlan(Long planId) throws Exception {

        SubscriptionPlan existingPlan = planRepository.findById(planId)
                        .orElseThrow(() -> new Exception("Plan not found!"));

        planRepository.delete(existingPlan);
    }

    @Override
    public List<SubscriptionPlanDTO> getAllSubscriptionPlan() {
        List<SubscriptionPlan> planList = planRepository.findAll();

        return planList.stream().map(planMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionPlan getBySubscriptionPlanCode(
            String subscriptionPlanCode) throws Exception {

        SubscriptionPlan plan = planRepository.findByPlanCode(subscriptionPlanCode);

        if (plan == null) {
            throw new Exception("Plan not found!");
        }
        return plan;
    }
}
