package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.FineStatus;
import com.sumit.bookstore.domain.FineType;
import com.sumit.bookstore.domain.PaymentGateway;
import com.sumit.bookstore.domain.PaymentType;
import com.sumit.bookstore.domain.UserRole;
import com.sumit.bookstore.model.BookLoan;
import com.sumit.bookstore.model.Fine;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.mapper.FineMapper;
import com.sumit.bookstore.payload.dto.FineDTO;
import com.sumit.bookstore.payload.request.CreateFineRequest;
import com.sumit.bookstore.payload.request.PaymentInitiateRequest;
import com.sumit.bookstore.payload.request.WaiveFineRequest;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.payload.response.PaymentInitiateResponse;
import com.sumit.bookstore.repository.IBookLoanRepo;
import com.sumit.bookstore.repository.IFineRepo;
import com.sumit.bookstore.service.IFineService;
import com.sumit.bookstore.service.IPaymentService;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FineServiceImpl implements IFineService {

    private final IBookLoanRepo bookLoanRepository;

    private final IFineRepo fineRepository;

    private final FineMapper fineMapper;

    private final IUserService userService;

    private final IPaymentService paymentService;


    @Override
    public FineDTO createFine(
            CreateFineRequest createFineRequest) {
        // 1. Validate book loan exist
        BookLoan bookLoan = bookLoanRepository.findById(createFineRequest.getBookLoanId())
                .orElseThrow(() -> new RuntimeException("Book loan doesn't exist"));

        // 2. Create fine
        Fine fine = Fine.builder()
                .bookLoan(bookLoan)
                .user(bookLoan.getUser())
                .type(createFineRequest.getType())
                .amount(createFineRequest.getAmount())
                .status(FineStatus.PENDING)
                .reason(createFineRequest.getReason())
                .notes(createFineRequest.getNotes())
                .build();

        Fine savedFine = fineRepository.save(fine);
        return fineMapper.toDTO(savedFine);
    }


    @Override
    public PaymentInitiateResponse payFine(Long fineId,
            String transactionId) throws Exception {

        // 1. Validate fine
        Fine fine = fineRepository.findById(fineId)
                        .orElseThrow(() -> new RuntimeException("Fine doesn't exist"));

        // 2. Check ownership. Admins may manage any fine; users may pay only their own fine.
        User currentUser = userService.getCurrentUser();
        if (!fine.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new RuntimeException("You can only pay your own fine");
        }

        // 3. Check already paid
        if (fine.getStatus().equals(FineStatus.PAID)) {
            throw new RuntimeException("fine already paid");
        }

        if (fine.getStatus().equals(FineStatus.WAIVED)) {
            throw new RuntimeException("fine waived");
        }

        // 4. Initiate payment
        User user = currentUser;

        PaymentInitiateRequest request = PaymentInitiateRequest.builder()
                        .userId(user.getId())
                        .fineId(fine.getId())
                        .paymentType(PaymentType.FINE)
                        .paymentGateway(PaymentGateway.RAZORPAY)
                        .amount(fine.getAmount())
                        .description("Library fine payment")
                        .build();

        return paymentService.initiatePayment(request);
    }


    @Override
    public void markFineAsPaid(Long fineId, Long amount,
            String transactionId) {

        Fine fine = fineRepository.findById(fineId)
                        .orElseThrow(
                                () -> new RuntimeException("Fine not found with id: " + fineId));

        // Apply payment amount safely
        fine.applyPayment(amount);
        fine.setTransactionId(transactionId);
        fine.setUpdatedAt(LocalDateTime.now());

        fineRepository.save(fine);
    }


    @Override
    public FineDTO waiveFine(WaiveFineRequest waiveFineRequest) throws Exception {

        Fine fine = fineRepository.findById(waiveFineRequest.getFineId())
                .orElseThrow(() -> new RuntimeException(
                        "Fine not found with id: " + waiveFineRequest.getFineId()));

        // 2. Check if already waived or paid
        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new RuntimeException("Fine has already been waived");
        }

        if (fine.getStatus() == FineStatus.PAID) {
            throw new RuntimeException("Fine has already been paid and cannot be waived");
        }

        // 3. Waive the fine
        User currentAdmin = userService.getCurrentUser();

        fine.waive(currentAdmin, waiveFineRequest.getReason());

        // 4. Save and return
        Fine savedFine = fineRepository.save(fine);
        return fineMapper.toDTO(savedFine);
    }


    @Override
    public List<FineDTO> getMyFines(FineStatus status, FineType type
    ) throws Exception {

        User currentUser = userService.getCurrentUser();

        List<Fine> fines;

        // Apply filters based on parameters
        if (status != null && type != null) {

            // Both filters
            fines = fineRepository
                    .findByUserId(currentUser.getId())
                            .stream()
                            .filter(f -> f.getStatus() == status && f.getType() == type)
                            .collect(Collectors.toList());

        } else if (status != null) {

            // Status filter only
            fines = fineRepository.findByUserId(currentUser.getId())
                            .stream()
                            .filter(f -> f.getStatus() == status)
                            .collect(Collectors.toList());

        } else if (type != null) {
            // Type filter only
            fines = fineRepository.findByUserIdAndType(currentUser.getId(), type);
        } else {

            // No filter - all fines for user
            fines = fineRepository.findByUserId(currentUser.getId());
        }

        return fines.stream()
                .map(fineMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    public PageResponse<FineDTO> getAllFines(
            FineStatus status,
            FineType type,
            Long userId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(
                        page,
                        size,
                        Sort.by("createdAt").descending()
                );

        Page<Fine> finePage = fineRepository.findAllWithFilters(
                        userId,
                        status,
                        type,
                        pageable
                );

        return convertToPageResponse(finePage);
    }


    private PageResponse<FineDTO> convertToPageResponse(
            Page<Fine> finePage) {

        List<FineDTO> fineDTOs = finePage.getContent()
                        .stream()
                        .map(fineMapper::toDTO)
                        .collect(Collectors.toList());

        return new PageResponse<>(
                fineDTOs,
                finePage.getNumber(),
                finePage.getSize(),
                finePage.getTotalElements(),
                finePage.getTotalPages(),
                finePage.isLast(),
                finePage.isFirst(),
                finePage.isEmpty()
        );
    }
}
