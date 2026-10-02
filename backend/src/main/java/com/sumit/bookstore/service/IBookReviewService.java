package com.sumit.bookstore.service;

import com.sumit.bookstore.payload.dto.BookReviewDTO;
import com.sumit.bookstore.payload.request.CreateReviewRequest;
import com.sumit.bookstore.payload.request.UpdateReviewRequest;
import com.sumit.bookstore.payload.response.PageResponse;

public interface IBookReviewService {

    BookReviewDTO createReview(CreateReviewRequest request) throws  Exception;

    BookReviewDTO updateReview(Long reviewId, UpdateReviewRequest request) throws Exception;

    void deleteReview(Long reviewId) throws Exception;

    PageResponse<BookReviewDTO> getReviewsByBookId(Long id, int page, int size) throws Exception;
}
