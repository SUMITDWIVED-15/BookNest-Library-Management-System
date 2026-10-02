package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.domain.BookLoanStatus;
import com.sumit.bookstore.mapper.BookReviewMapper;
import com.sumit.bookstore.model.Book;
import com.sumit.bookstore.model.BookLoan;
import com.sumit.bookstore.model.BookReview;
import com.sumit.bookstore.model.User;
import com.sumit.bookstore.payload.dto.BookReviewDTO;
import com.sumit.bookstore.payload.request.CreateReviewRequest;
import com.sumit.bookstore.payload.request.UpdateReviewRequest;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.repository.IBookLoanRepo;
import com.sumit.bookstore.repository.IBookRepo;
import com.sumit.bookstore.repository.IBookReviewRepo;
import com.sumit.bookstore.service.IBookReviewService;
import com.sumit.bookstore.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookReviewServiceImpl
        implements IBookReviewService {

    private final IBookReviewRepo bookReviewRepository;

    private final IUserService userService;

    private final IBookRepo bookRepository;

    private final IBookLoanRepo bookLoanRepository;

    private final BookReviewMapper bookReviewMapper;


    @Override
    public BookReviewDTO createReview(CreateReviewRequest request
    ) throws Exception {

        // 1. Fetch the logged user
        User user = userService.getCurrentUser();


        // 2. Validate book exists
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new Exception("book not found!"));


        // 3. Check if user has already reviewed the book
        if (bookReviewRepository.existsByUserIdAndBookId(user.getId(), book.getId())) {
            throw new Exception("book review already exists!");
        }


        // 4. Check if user has read the book
        boolean hasReadBook = hasUserReadBook(user.getId(), book.getId());

        if (!hasReadBook) {
            throw new Exception("you have not read this book!");
        }


        // 5. Create review
        BookReview bookReview = new BookReview();
        bookReview.setUser(user);
        bookReview.setBook(book);
        bookReview.setRating(request.getRating());
        bookReview.setReviewText(request.getReviewText());
        bookReview.setTitle(request.getTitle());

        BookReview savedBookReview = bookReviewRepository.save(bookReview);
        return bookReviewMapper.toDTO(savedBookReview);
    }


    @Override
    public BookReviewDTO updateReview(Long reviewId,
            UpdateReviewRequest request) throws Exception {

        // 1. Fetch logged user
        User user = userService.getCurrentUser();

        // 2. Find review
        BookReview bookReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("review not found!"));


        // 3. Check if logged user is the owner
        if (!bookReview.getUser().getId().equals(user.getId())) {
            throw new Exception("you have not reviewed this book!");
        }


        // 4. Update review
        bookReview.setReviewText(request.getReviewText());
        bookReview.setTitle(request.getTitle());
        bookReview.setRating(request.getRating());


        BookReview savedBookReview = bookReviewRepository.save(bookReview);
        return bookReviewMapper.toDTO(savedBookReview);
    }


    @Override
    public void deleteReview(Long reviewId) throws Exception {

        User currentUser = userService.getCurrentUser();

        // 1. Find the review
        BookReview bookReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found with id: " + reviewId));


        // 2. Check if current user is the owner
        if (!bookReview.getUser().getId().equals(currentUser.getId())) {
            throw new Exception("you can only delete your own reviews");
        }

        bookReviewRepository.delete(bookReview);
    }


    @Override
    public PageResponse<BookReviewDTO> getReviewsByBookId(
            Long id,
            int page,
            int size
    ) throws Exception {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new Exception("book not found by id!"));


        Pageable pageable = PageRequest.of(
                        page,
                        size,
                        Sort.by("createdAt").descending()
                );


        Page<BookReview> reviewPage = bookReviewRepository.findByBook(
                        book,
                        pageable
                );


        return convertToPageResponse(reviewPage);
    }


    private PageResponse<BookReviewDTO> convertToPageResponse(
            Page<BookReview> reviewPage) {

        List<BookReviewDTO> reviewDTOs = reviewPage.getContent()
                        .stream()
                        .map(bookReviewMapper::toDTO)
                        .collect(Collectors.toList());


        return new PageResponse<>(
                reviewDTOs,
                reviewPage.getNumber(),
                reviewPage.getSize(),
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages(),
                reviewPage.isLast(),
                reviewPage.isFirst(),
                reviewPage.isEmpty()
        );
    }


    private boolean hasUserReadBook(Long userId, Long bookId) {

        List<BookLoan> bookLoans = bookLoanRepository.findByBookId(bookId);

        return bookLoans.stream().anyMatch(loan
                -> loan.getUser().getId().equals(userId)
                && loan.getStatus() == BookLoanStatus.RETURNED);
    }
}