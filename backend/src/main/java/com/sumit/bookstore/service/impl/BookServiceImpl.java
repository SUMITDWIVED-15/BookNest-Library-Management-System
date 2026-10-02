package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.exception.BookException;
import com.sumit.bookstore.mapper.BookMapper;
import com.sumit.bookstore.model.Book;
import com.sumit.bookstore.payload.dto.BookDTO;
import com.sumit.bookstore.payload.request.BookSearchRequest;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.repository.IBookRepo;
import com.sumit.bookstore.service.IBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements IBookService {

    private final IBookRepo bookRepository;
    private final BookMapper bookMapper;



    // CREATE BOOK
    @Override
    public BookDTO createBook(BookDTO bookDTO) throws BookException {

        if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
            throw new BookException(
                    "book with isbn " + bookDTO.getIsbn() + " already exists"
            );
        }

        Book book = bookMapper.toEntity(bookDTO);
        book.isAvailableCopiesValid();
        Book savedBook = bookRepository.save(book);

        return bookMapper.toDTO(savedBook);
    }

    @Override
    public List<BookDTO> createBooksBulk(List<BookDTO> bookDTOs) throws BookException {

            List<BookDTO> createdBooks = new ArrayList<>();
            for (BookDTO bookDTO : bookDTOs) {
                BookDTO book = createBook(bookDTO);
                createdBooks.add(book);
            }
            return createdBooks;
    }


    // CREATE BOOKS IN BULK



    // =========================
    // GET BOOK BY ID
    // =========================

    @Override
    public BookDTO getBookById(Long bookId) throws BookException {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("book not found!"));

        return bookMapper.toDTO(book);
    }



    // GET BOOK BY ISBN
    @Override
    public BookDTO getBookByISBN(String isbn) throws BookException {

        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookException("book not found!"));
        return bookMapper.toDTO(book);
    }


    // UPDATE BOOK
    @Override
    public BookDTO updateBook(Long bookId, BookDTO bookDTO)
            throws BookException {

        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new BookException("book not found!")
                );

        bookMapper.updateEntityFromDTO(bookDTO, existingBook);
        existingBook.isAvailableCopiesValid();
        Book savedBook = bookRepository.save(existingBook);

        return bookMapper.toDTO(savedBook);
    }


    // SOFT DELETE
    @Override
    public void deleteBook(Long bookId) throws BookException {

        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new BookException("book not found!")
                );

        existingBook.setActive(false);

        bookRepository.save(existingBook);
    }



    // HARD DELETE
    @Override
    public void hardDeleteBook(Long bookId) throws BookException {

        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new BookException("book not found!")
                );

        bookRepository.delete(existingBook);
    }




    // SEARCH BOOKS WITH FILTERS
    @Override
    public PageResponse<BookDTO> searchBooksWithFilters(BookSearchRequest searchRequest) {

        Pageable pageable = createPageable(
                searchRequest.getPage(),
                searchRequest.getSize(),
                searchRequest.getSortBy(),
                searchRequest.getSortDirection()
        );

        Page<Book> bookPage =
                bookRepository.searchBooksWithFilters(
                        searchRequest.getSearchTerm(),
                        searchRequest.getGenreId(),
                        searchRequest.getAvailableOnly(),
                        pageable
                );

        return convertToPageResponse(bookPage);
    }


    // TOTAL ACTIVE BOOKS
    @Override
    public long getTotalActiveBooks() {

        return bookRepository.countByActiveTrue();
    }



    // TOTAL AVAILABLE BOOKS
    @Override
    public long getTotalAvailableBooks() {

        return bookRepository.countAvailableBooks();
    }



    // CREATE PAGEABLE
    private Pageable createPageable(int page, int size, String sortBy, String sortDirection) {

        size = Math.min(size, 10);
        size = Math.max(size, 1);

        Sort sort = sortDirection.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return PageRequest.of(page, size, sort);
    }



    // CONVERT PAGE TO PAGINATION RESPONSE
    private PageResponse<BookDTO> convertToPageResponse(Page<Book> books) {

        List<BookDTO> bookDTOS = books.getContent()
                .stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(bookDTOS,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isLast(),
                books.isFirst(),
                books.isEmpty()
        );
    }
}

