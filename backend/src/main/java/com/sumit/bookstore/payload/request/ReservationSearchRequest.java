package com.sumit.bookstore.payload.request;

import com.sumit.bookstore.domain.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationSearchRequest {

    private Long userId;

    // Book filter
    private Long bookId;

    // Status filter
    private ReservationStatus status;

    // Active only (PENDING or AVAILABLE)
    private Boolean activeOnly;

    // Pagination
    private int page = 0;

    private int size = 20;

    // Sorting
    private String sortBy = "reservedAt";

    private String sortDirection = "DESC";
}
