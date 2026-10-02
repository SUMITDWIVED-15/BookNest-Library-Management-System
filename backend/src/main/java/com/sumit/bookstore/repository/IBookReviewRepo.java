package com.sumit.bookstore.repository;

import com.sumit.bookstore.model.Book;
import com.sumit.bookstore.model.BookReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookReviewRepo extends JpaRepository<BookReview, Long> {

    Page<BookReview> findByBook(Book book, Pageable pageable);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);
}
