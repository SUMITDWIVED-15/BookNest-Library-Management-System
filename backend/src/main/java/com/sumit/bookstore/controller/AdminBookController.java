package com.sumit.bookstore.controller;

import com.sumit.bookstore.exception.BookException;
import com.sumit.bookstore.payload.dto.BookDTO;
import com.sumit.bookstore.service.IBookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/books")
public class AdminBookController {

    private final IBookService bookService;

    //API for Create Book
    @PostMapping
    public ResponseEntity<BookDTO> createBook(
            @Valid @RequestBody BookDTO bookDTO) throws BookException {

        BookDTO createBook = bookService.createBook(bookDTO);
        return ResponseEntity.ok(createBook);
    }

    //API for create books in bulk
    @PostMapping("/bulk")
    public ResponseEntity<?> createBooksBulk(
            @Valid @RequestBody List<BookDTO> bookDTOS) throws BookException{

        List<BookDTO> createBooks = bookService.createBooksBulk(bookDTOS);
        return ResponseEntity.ok(createBooks);
    }
}
