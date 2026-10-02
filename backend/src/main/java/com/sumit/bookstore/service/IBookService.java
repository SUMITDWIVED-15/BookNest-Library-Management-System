package com.sumit.bookstore.service;

import com.sumit.bookstore.exception.BookException;
import com.sumit.bookstore.payload.request.BookSearchRequest;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.payload.dto.BookDTO;

import java.util.List;

public interface IBookService {

    BookDTO createBook (BookDTO bookDTO) throws BookException;

    List<BookDTO> createBooksBulk(List<BookDTO> bookDTOs) throws BookException;

    BookDTO getBookById(Long bookId) throws BookException;

    BookDTO getBookByISBN(String isbn) throws BookException;

    BookDTO updateBook(Long bookId, BookDTO bookDTO) throws BookException;

    void deleteBook(Long bookId) throws BookException;

    void hardDeleteBook(Long bookId) throws BookException;

    PageResponse<BookDTO> searchBooksWithFilters(
            BookSearchRequest searchRequest );

    long getTotalActiveBooks() ;

    long getTotalAvailableBooks() ;
}
