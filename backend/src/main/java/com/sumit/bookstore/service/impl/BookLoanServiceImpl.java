package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.BookLoanStatus;
import com.sumit.bookstore.domain.BookLoanType;
import com.sumit.bookstore.exception.BookException;
import com.sumit.bookstore.model.Book;
import com.sumit.bookstore.model.BookLoan;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.domain.UserRole;
import com.sumit.bookstore.payload.dto.BookLoanDTO;
import com.sumit.bookstore.payload.request.BookLoanSearchRequest;
import com.sumit.bookstore.payload.request.CheckinRequest;
import com.sumit.bookstore.payload.request.CheckoutRequest;
import com.sumit.bookstore.payload.request.RenewalRequest;
import com.sumit.bookstore.payload.response.PageResponse;

import com.sumit.bookstore.mapper.BookLoanMapper;
import com.sumit.bookstore.repository.IBookLoanRepo;
import com.sumit.bookstore.repository.IBookRepo;
import com.sumit.bookstore.service.IBookLoanService;
import com.sumit.bookstore.service.ISubscriptionService;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class BookLoanServiceImpl implements IBookLoanService {

    private final IBookLoanRepo bookLoanRepository;

    private final IUserService userService;

    private final ISubscriptionService subscriptionService;

    private final IBookRepo bookRepository;

    private final BookLoanMapper bookLoanMapper;


    @Override
    public BookLoanDTO checkoutBook(CheckoutRequest checkoutRequest
    ) throws Exception {

        User user = userService.getCurrentUser();
        return checkoutBookForUser(user.getId(), checkoutRequest);
    }


    @Override
    public BookLoanDTO checkoutBookForUser(Long userId,
            CheckoutRequest checkoutRequest) throws Exception {

        // 1. Validate user exists
        User user = userService.findById(userId);


        // 2. Validate user has active subscription
        var subscription = subscriptionService.getUsersActiveSubscription(user.getId());


        // 3. Validate book exists and is available
        Book book = bookRepository.findById(checkoutRequest.getBookId())
                .orElseThrow(() -> new BookException("book not found with id "
                                        + checkoutRequest.getBookId()));


        if (!book.getActive()) {
            throw new BookException("book is not active");
        }

        if (book.getAvailableCopies() <= 0) {
            throw new BookException("book is not available");
        }

        // 4. Check if user already has this book checkout
        if (bookLoanRepository.hasActiveCheckout(userId,
                book.getId())) {
            throw new BookException("book already has active checkout");
        }


        // 5. Check user's active checkout limit
        long activeCheckouts = bookLoanRepository.countActiveBookLoansByUser(userId);
        int maxBooksAllowed = subscription.getMaxBooksAllowed();

        if (activeCheckouts >= maxBooksAllowed) {
            throw new Exception("you have reached your maximum number of books allowed");
        }


        // 6. Check for overdue books
        long overdueCount = bookLoanRepository.countOverdueBookLoansByUser(userId);

        if (overdueCount > 0) {
            throw new Exception("first return old overdue book!");
        }


        // 7. Create book loan
        BookLoan bookLoan = BookLoan.builder()
                .user(user)
                .book(book)
                .type(BookLoanType.CHECKOUT)
                .status(BookLoanStatus.CHECKED_OUT)
                .checkoutDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(checkoutRequest.getCheckoutDays()))
                .renewalCount(0)
                .maxRenewals(2)
                .notes(checkoutRequest.getNotes())
                .isOverdue(false)
                .overdueDays(0)
                .build();


        // 8. Update book available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);


        // 10. Save book loan
        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);
        return bookLoanMapper.toDTO(savedBookLoan);
    }


    @Override
    public BookLoanDTO checkinBook(CheckinRequest checkinRequest
    ) throws Exception {

        // 1. Validate book loan exists
        BookLoan bookLoan = bookLoanRepository.findById(checkinRequest.getBookLoanId()
        ).orElseThrow(() -> new Exception("Book loan not found!"));


        // 2. Check ownership. Admins may manage any loan; users may only manage their own.
        User currentUser = userService.getCurrentUser();
        if (!bookLoan.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new BookException("You can only check in your own book loans");
        }

        // 3. Check if already returned
        if (!bookLoan.isActive()) {
            throw new BookException("book loan is not active");
        }

        // 4. Set return date
        bookLoan.setReturnDate(LocalDate.now());


        // 5. Set condition
        BookLoanStatus condition = checkinRequest.getCondition();

        if (condition == null) {
            condition = BookLoanStatus.RETURNED;
        }
        bookLoan.setStatus(condition);


        // 6. Reset overdue state after check-in.
        bookLoan.setOverdueDays(0);
        bookLoan.setIsOverdue(false);

        // 7. Notes
        bookLoan.setNotes("book returned by user");

        // 8. Update availability only when the physical book is actually returned.
        // LOST and DAMAGED books do not become available again.
        if (condition == BookLoanStatus.RETURNED) {
            Book book = bookLoan.getBook();
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }

        // 9. Save book loan
        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);
        return bookLoanMapper.toDTO(savedBookLoan);
    }


    @Override
    public BookLoanDTO renewCheckout(RenewalRequest renewalRequest
    ) throws Exception {

        // 1. Validate book loan exists
        BookLoan bookLoan = bookLoanRepository.findById(renewalRequest.getBookLoanId())
                .orElseThrow(() -> new Exception("bookloan not found!"));

        // 2. Check ownership. Admins may renew any loan; users may only renew their own.
        User currentUser = userService.getCurrentUser();
        if (!bookLoan.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new BookException("You can only renew your own book loans");
        }

        // 3. Check if can be renewed
        if (!bookLoan.canRenew()) {
            throw new BookException("book cannot be renewed");
        }


        // 4. Update due date
        bookLoan.setDueDate(bookLoan.getDueDate()
                        .plusDays(renewalRequest.getExtensionDays()));

        bookLoan.setRenewalCount(bookLoan.getRenewalCount() + 1);
        bookLoan.setNotes("book renewed by user");

        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);
        return bookLoanMapper.toDTO(savedBookLoan);
    }


    @Override
    public PageResponse<BookLoanDTO> getMyBookLoans(
            BookLoanStatus status,
            int page, int size) throws Exception {

        User currentUser = userService.getCurrentUser();
        Page<BookLoan> bookLoanPage;

        if (status == null) {
            // Return active checkouts, sorted by due date
            Pageable pageable = PageRequest.of(
                            page,
                            size,
                            Sort.by("dueDate").ascending());

            /*
             * The PDF uses findByStatusAndUser here.
             * Since status is null in this branch, that is
             * logically inconsistent with the comment.
             */
            bookLoanPage =
                    bookLoanRepository.findByStatusAndUser(
                            BookLoanStatus.CHECKED_OUT,
                            currentUser,
                            pageable );

        } else {
            // Return all loans for the current user,
            // sorted by creation date descending
            Pageable pageable = PageRequest.of(
                            page,
                            size,
                            Sort.by("createdAt").descending()
                    );

            bookLoanPage = bookLoanRepository.findByUserId(
                            currentUser.getId(),
                            pageable );
        }

        return convertToPageResponse(bookLoanPage);
    }


    @Override
    public PageResponse<BookLoanDTO> getBookLoans(BookLoanSearchRequest searchRequest
    ) throws Exception {

        Pageable pageable = createPageable(
                searchRequest.getPage(),
                searchRequest.getSize(),
                searchRequest.getSortBy(),
                searchRequest.getSortDirection()
        );

        Page<BookLoan> bookLoanPage;

        // 2. Apply filtering logic dynamically
        if (Boolean.TRUE.equals(searchRequest.getOverdueOnly())) {
            // Fetch overdue loans
            bookLoanPage = bookLoanRepository.findOverdueBookLoans(
                            LocalDate.now(),
                            pageable
                    );

        } else if (searchRequest.getUserId() != null) {
            // Fetch loans by specific user
            bookLoanPage = bookLoanRepository.findByUserId(
                            searchRequest.getUserId(),
                            pageable
                    );

        } else if (searchRequest.getBookId() != null) {

            // Fetch loans by specific book
            bookLoanPage = bookLoanRepository.findByBookId(
                            searchRequest.getBookId(),
                            pageable
                    );

        } else if (searchRequest.getStatus() != null) {
            // Fetch loans by loan status
            bookLoanPage = bookLoanRepository.findByStatus(
                            searchRequest.getStatus(),
                            pageable
                    );

        } else if (searchRequest.getStartDate() != null
                        && searchRequest.getEndDate() != null) {

            // Fetch loans within date range
            bookLoanPage = bookLoanRepository.findBookLoansByDateRange(
                            searchRequest.getStartDate(),
                            searchRequest.getEndDate(),
                            pageable
                    );

        } else {
            // Default: return all loans
            bookLoanPage = bookLoanRepository.findAll(pageable);
        }

        // 3. Convert entities to DTOs and wrap
        // in response object
        return convertToPageResponse(bookLoanPage);
    }


    @Override
    public int updateOverdueBookLoan() {

        Pageable pageable = PageRequest.of(0, 1000);

        Page<BookLoan> overduePage = bookLoanRepository.findOverdueBookLoans(
                        LocalDate.now(),
                        pageable
                );

        int updateCount = 0;
        for (BookLoan bookLoan : overduePage.getContent()) {

            if (bookLoan.getStatus() == BookLoanStatus.CHECKED_OUT) {

                bookLoan.setStatus(BookLoanStatus.OVERDUE);
                bookLoan.setIsOverdue(true);

                // Calculate overdue days
                int overdueDays = calculateOverdueDate(
                                bookLoan.getDueDate(),
                                LocalDate.now()
                        );

                bookLoan.setOverdueDays(overdueDays);
                // Calculate fine - TODO
                // BigDecimal fine =
                //     fineCalculationService
                //         .calculateOverdueFine(bookLoan);
                bookLoanRepository.save(bookLoan);

                updateCount++;
            }
        }
        return updateCount;
    }


    private Pageable createPageable(
            int page,
            int size,
            String sortBy,
            String sortDirection
    ) {

        size = Math.min(size, 100);
        size = Math.max(size, 1);

        Sort sort = sortDirection.equalsIgnoreCase("ASC")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        return PageRequest.of(page, size, sort);
    }


    private PageResponse<BookLoanDTO> convertToPageResponse(
            Page<BookLoan> bookLoanPage) {

        var bookLoanDTOs = bookLoanPage.getContent()
                        .stream()
                        .map(bookLoanMapper::toDTO)
                        .toList();

        return new PageResponse<>(
                bookLoanDTOs,
                bookLoanPage.getNumber(),
                bookLoanPage.getSize(),
                bookLoanPage.getTotalElements(),
                bookLoanPage.getTotalPages(),
                bookLoanPage.isLast(),
                bookLoanPage.isFirst(),
                bookLoanPage.isEmpty()
        );
    }


    private int calculateOverdueDate(
            LocalDate dueDate,
            LocalDate today
    ) {

        if (today.isBefore(dueDate) || today.isEqual(dueDate)) {

            return 0;
        }
        return (int) ChronoUnit.DAYS.between(dueDate, today);
    }
}
