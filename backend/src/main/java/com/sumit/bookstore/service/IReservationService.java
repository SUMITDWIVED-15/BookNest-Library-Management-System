package com.sumit.bookstore.service;

import com.sumit.bookstore.payload.dto.ReservationDTO;
import com.sumit.bookstore.payload.request.ReservationRequest;
import com.sumit.bookstore.payload.request.ReservationSearchRequest;
import com.sumit.bookstore.payload.response.PageResponse;

public interface IReservationService {

    ReservationDTO createReservation(ReservationRequest reservationRequest) throws Exception;

    ReservationDTO createReservationForUser(ReservationRequest reservationRequest,
            Long userId) throws Exception;

    ReservationDTO cancelReservation(Long reservationId) throws Exception;

    ReservationDTO fulfillReservation(Long reservationId) throws Exception;

    /**
     * Get my reservations (current user) with filters
     */
    PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest searchRequest) throws Exception;

    PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest searchRequest);
}
