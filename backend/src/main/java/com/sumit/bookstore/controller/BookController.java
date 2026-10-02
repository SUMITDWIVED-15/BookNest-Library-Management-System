package com.sumit.bookstore.controller;

import com.sumit.bookstore.exception.BookException;
import com.sumit.bookstore.payload.dto.BookDTO;
import com.sumit.bookstore.payload.request.BookSearchRequest;
import com.sumit.bookstore.payload.response.ApiResponse;
import com.sumit.bookstore.payload.response.PageResponse;
import com.sumit.bookstore.service.IBookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")
public class BookController {

    private final IBookService bookService;


    //Book entity access by id
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id)
            throws BookException{
        BookDTO book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    //Update a book
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long id,
            @RequestBody BookDTO bookDTO) throws BookException{

        BookDTO updatedBook = bookService.updateBook(id,bookDTO);
        return ResponseEntity.ok(updatedBook);
    }

    //Soft delete a book (marks as inactive)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable Long id)
            throws BookException{
        bookService.deleteBook(id);
        return ResponseEntity.ok(new ApiResponse("Book deleted successfully",true));

    }

   // Hard delete a book (permanently deleted)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> hardDeleteBook(@PathVariable Long id)
            throws BookException{
        bookService.hardDeleteBook(id);
        return ResponseEntity.ok(new ApiResponse("Book permanently deleted successfully",true));

    }

    @PostMapping("/search")
    public ResponseEntity<PageResponse<BookDTO>> advancedSearch(
            @RequestBody BookSearchRequest bookSearchRequest){

        PageResponse<BookDTO> books = bookService.searchBooksWithFilters(bookSearchRequest);
        return ResponseEntity.ok(books);
    }

    // Getting all the books
    @GetMapping
    public ResponseEntity<PageResponse<BookDTO>> searchBooks(
            @RequestParam(required = false) Long genreId,
            @RequestParam(required = false, defaultValue = "false") Boolean availableOnly,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        // Build search request from query parameters
        BookSearchRequest searchRequest = new BookSearchRequest();

        searchRequest.setGenreId(genreId);
        searchRequest.setAvailableOnly(availableOnly);
        searchRequest.setPage(page);
        searchRequest.setSize(size);
        searchRequest.setSortBy(sortBy);
        searchRequest.setSortDirection(sortDirection);

        PageResponse<BookDTO> books =
                bookService.searchBooksWithFilters(searchRequest);

        return ResponseEntity.ok(books);
    }

    // Getting TotalActive books and TotalAvailable books
    @GetMapping("/stats")
    public ResponseEntity<BookStatsResponse> getBookStats() {

        Long totalActive = bookService.getTotalActiveBooks();
        Long totalAvailable = bookService.getTotalAvailableBooks();

        BookStatsResponse stats =
                new BookStatsResponse(totalActive, totalAvailable);

        return ResponseEntity.ok(stats);
    }


    /**
     * Statistics response DTO
     */
    public static class BookStatsResponse {

        public Long totalActiveBooks;
        public Long totalAvailableBooks;

        public BookStatsResponse(Long totalActiveBooks, Long totalAvailableBooks) {
            this.totalActiveBooks = totalActiveBooks;
            this.totalAvailableBooks = totalAvailableBooks;
        }
    }

}
