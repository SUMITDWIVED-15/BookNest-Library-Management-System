package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.BookLoanStatus;
import com.sumit.bookstore.domain.ReservationStatus;
import com.sumit.bookstore.domain.UserRole;
import com.sumit.bookstore.model.Book;
import com.sumit.bookstore.model.Reservation;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.mapper.ReservationMapper;
import com.sumit.bookstore.payload.dto.ReservationDTO;
import com.sumit.bookstore.payload.request.CheckoutRequest;
import com.sumit.bookstore.payload.request.ReservationRequest;
import com.sumit.bookstore.payload.request.ReservationSearchRequest;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.repository.IBookLoanRepo;
import com.sumit.bookstore.repository.IBookRepo;
import com.sumit.bookstore.repository.IReservationRepo;
import com.sumit.bookstore.service.IBookLoanService;
import com.sumit.bookstore.service.IReservationService;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl
        implements IReservationService {

    private final IBookLoanRepo bookLoanRepository;

    private final IUserService userService;

    private final IBookRepo bookRepository;

    private final IReservationRepo reservationRepository;

    private final ReservationMapper reservationMapper;

    private final IBookLoanService bookLoanService;

    private static final int MAX_RESERVATIONS = 5;


    @Override
    public ReservationDTO createReservation(
            ReservationRequest reservationRequest) throws Exception {

        User user = userService.getCurrentUser();
        return createReservationForUser(reservationRequest, user.getId());
    }


    @Override
    public ReservationDTO createReservationForUser(
            ReservationRequest reservationRequest,
            Long userId) throws Exception {

        boolean alreadyHasLoan = bookLoanRepository.existsByUserIdAndBookIdAndStatus(
                        userId,
                        reservationRequest.getBookId(),
                        BookLoanStatus.CHECKED_OUT
                );

        if (alreadyHasLoan) {
            throw new RuntimeException("you already have loan this book");
        }

        User user = userService.findById(userId);
        Book book = bookRepository.findById(reservationRequest.getBookId())
                .orElseThrow(() -> new RuntimeException("book not found"));

        if (reservationRepository.hasActiveReservation(userId, book.getId())) {
            throw new RuntimeException("you have already reservation on this book");
        }

        if (book.getAvailableCopies() > 0) {
            throw new RuntimeException("book is already available");
        }


        long activeReservations = reservationRepository
                        .countActiveReservationsByUser(userId);

        if (activeReservations >= MAX_RESERVATIONS) {
            throw new RuntimeException("you have reserved " + MAX_RESERVATIONS + " times");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setNotificationSent(false);
        reservation.setNotes(reservationRequest.getNotes());

        long pendingCount = reservationRepository
                        .countPendingReservationsByBook(book.getId());

        reservation.setQueuePosition((int) pendingCount + 1);
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toDTO(savedReservation);
    }


    @Override
    public ReservationDTO cancelReservation(Long reservationId
    ) throws Exception {

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(
                () -> new RuntimeException("Reservation not found with ID: " + reservationId));


        User currentUser = userService.getCurrentUser();
        if (!reservation.getUser()
                        .getId()
                        .equals(currentUser.getId())
                        && currentUser.getRole()
                        != UserRole.ROLE_ADMIN
        ) {
            throw new RuntimeException("You can only cancel your own reservations");
        }


        if (!reservation.canBeCancelled()) {

            throw new RuntimeException("Reservation cannot be cancelled " +
                            "(current status: " + reservation.getStatus() + ")"
            );
        }


        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());
        Reservation savedReservation = reservationRepository.save(reservation);

        return reservationMapper.toDTO(savedReservation);
    }


    @Override
    public ReservationDTO fulfillReservation(Long reservationId
    ) throws Exception {

        Reservation reservation = reservationRepository.findById(reservationId
                ).orElseThrow(
                        () -> new Exception("Reservation not found with ID: " + reservationId)
        );

        if (
                reservation.getBook().getAvailableCopies() <= 0
        ) {
            throw new Exception("Reservation is not available for pickup " +
                            "(current status: " + reservation.getStatus() + ")"
            );
        }


        reservation.setStatus(ReservationStatus.FULFILLED);
        reservation.setFulfilledAt(LocalDateTime.now());
        Reservation savedReservation = reservationRepository.save(reservation);
        CheckoutRequest request = new CheckoutRequest();
        request.setBookId(reservation.getBook().getId());
        request.setNotes("Assign Booked by Admin");


        bookLoanService.checkoutBookForUser(reservation.getUser().getId(), request);
        return reservationMapper.toDTO(savedReservation);
    }


    @Override
    public PageResponse<ReservationDTO> getMyReservations(
            ReservationSearchRequest searchRequest) throws Exception {

        User user = userService.getCurrentUser();

        searchRequest.setUserId(user.getId());
        return searchReservations(searchRequest);
    }


    @Override
    public PageResponse<ReservationDTO> searchReservations(
            ReservationSearchRequest searchRequest) {

        Pageable pageable = createPageable(searchRequest);


        Page<Reservation> reservationPage = reservationRepository
                        .searchReservationsWithFilters(
                                searchRequest.getUserId(),
                                searchRequest.getBookId(),
                                searchRequest.getStatus(),
                                searchRequest.getActiveOnly() != null && searchRequest.getActiveOnly(), pageable
                        );


        return buildPageResponse(reservationPage);
    }


    private PageResponse<ReservationDTO> buildPageResponse(
            Page<Reservation> reservationPage
    ) {

        List<ReservationDTO> dtos = reservationPage
                        .getContent()
                        .stream()
                        .map(reservationMapper::toDTO)
                        .toList();


        PageResponse<ReservationDTO> response = new PageResponse<>();
        response.setContent(dtos);
        response.setPageNumber(reservationPage.getNumber());
        response.setPageSize(reservationPage.getSize());
        response.setTotalElements(reservationPage.getTotalElements());
        response.setTotalPages(reservationPage.getTotalPages());
        response.setLast(reservationPage.isLast());

        return response;
    }


    private Pageable createPageable(
            ReservationSearchRequest searchRequest
    ) {

        Sort sort = searchRequest
                        .getSortDirection()
                        .equalsIgnoreCase("ASC")
                        ? Sort.by(searchRequest.getSortBy()).ascending()
                        : Sort.by(searchRequest.getSortBy()).descending();


        return PageRequest.of(
                searchRequest.getPage(),
                searchRequest.getSize(),
                sort
        );
    }
}