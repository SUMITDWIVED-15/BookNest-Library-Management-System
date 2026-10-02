package com.sumit.bookstore.service;

import com.sumit.bookstore.domain.BookLoanStatus;
import com.sumit.bookstore.payload.dto.BookLoanDTO;
import com.sumit.bookstore.payload.request.BookLoanSearchRequest;
import com.sumit.bookstore.payload.request.CheckinRequest;
import com.sumit.bookstore.payload.request.CheckoutRequest;
import com.sumit.bookstore.payload.request.RenewalRequest;
import com.sumit.bookstore.payload.response.PageResponse;

public interface IBookLoanService {

    BookLoanDTO checkoutBook(CheckoutRequest checkoutRequest) throws Exception;

    BookLoanDTO checkoutBookForUser(Long userId, CheckoutRequest checkoutRequest
    ) throws Exception;

    BookLoanDTO checkinBook(CheckinRequest checkinRequest) throws Exception;

    BookLoanDTO renewCheckout(RenewalRequest renewalRequest) throws Exception;

    PageResponse<BookLoanDTO> getMyBookLoans(BookLoanStatus status,
            int page, int size) throws Exception;

    PageResponse<BookLoanDTO> getBookLoans(BookLoanSearchRequest request) throws Exception;

    int updateOverdueBookLoan();
}
