package com.sumit.bookstore.service;

import com.sumit.bookstore.domain.FineStatus;
import com.sumit.bookstore.domain.FineType;
import com.sumit.bookstore.payload.dto.FineDTO;
import com.sumit.bookstore.payload.request.CreateFineRequest;
import com.sumit.bookstore.payload.request.WaiveFineRequest;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.payload.response.PaymentInitiateResponse;

import java.util.List;

public interface IFineService {

    FineDTO createFine(CreateFineRequest createFineRequest);

    PaymentInitiateResponse payFine(Long fineId, String transactionId) throws Exception;

    void markFineAsPaid(Long fineId, Long amount, String transactionId);

    FineDTO waiveFine(WaiveFineRequest waiveFineRequest) throws Exception;

    List<FineDTO> getMyFines(FineStatus status, FineType type) throws Exception;

    PageResponse<FineDTO> getAllFines(FineStatus status, FineType type,
            Long userId, int page, int size);
}
