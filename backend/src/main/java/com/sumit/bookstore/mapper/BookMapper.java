package com.sumit.bookstore.mapper;

import com.sumit.bookstore.exception.BookException;
import com.sumit.bookstore.model.Book;
import com.sumit.bookstore.model.Genre;
import com.sumit.bookstore.payload.dto.BookDTO;
import com.sumit.bookstore.repository.IGenreRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookMapper {

    private final IGenreRepo genreRepository;

    public BookDTO toDTO(Book book) {

        if (book == null) {
            return null;
        }

        BookDTO dto = BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .publishedDate(book.getPublishedDate())
                .language(book.getLanguage())
                .pages(book.getPages())
                .description(book.getDescription())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .price(book.getPrice())
                .coverImageUrl(book.getCoverImageUrl())
                .active(book.getActive())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();

        // Map genre information
        if (book.getGenre() != null) {
            dto.setGenreId(book.getGenre().getId());
            dto.setGenreName(book.getGenre().getName());
            dto.setGenreCode(book.getGenre().getCode());
        }

        return dto;
    }


    // =========================
    // DTO -> Entity
    // =========================
    public Book toEntity(BookDTO dto) throws BookException {

        if (dto == null) {
            return null;
        }

        Book book = new Book();

        book.setId(dto.getId());
        book.setIsbn(dto.getIsbn());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());

        // Map genre - fetch from database using genreId
        if (dto.getGenreId() != null) {

            Genre genre = genreRepository.findById(dto.getGenreId())
                    .orElseThrow(() -> new BookException(
                            "Genre with ID " + dto.getGenreId() + " not found"
                    ));

            book.setGenre(genre);
        }

        book.setPublisher(dto.getPublisher());
        book.setPublishedDate(dto.getPublishedDate());
        book.setLanguage(dto.getLanguage());
        book.setPages(dto.getPages());
        book.setDescription(dto.getDescription());
        book.setTotalCopies(dto.getTotalCopies());
        book.setAvailableCopies(dto.getAvailableCopies());
        book.setPrice(dto.getPrice());
        book.setCoverImageUrl(dto.getCoverImageUrl());

        book.setActive(true); // Default to active

        return book;
    }


    // Update existing Entity
    public void updateEntityFromDTO(BookDTO dto, Book book)
            throws BookException {

        if (dto == null || book == null) {
            return;
        }

        // ISBN should not be updated
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());

        // Update genre if provided
        if (dto.getGenreId() != null) {

            Genre genre = genreRepository.findById(dto.getGenreId())
                    .orElseThrow(() -> new BookException(
                            "Genre with ID " + dto.getGenreId() + " not found"
                    ));

            book.setGenre(genre);
        }

        book.setPublisher(dto.getPublisher());
        book.setPublishedDate(dto.getPublishedDate());
        book.setLanguage(dto.getLanguage());
        book.setPages(dto.getPages());
        book.setDescription(dto.getDescription());
        book.setTotalCopies(dto.getTotalCopies());
        book.setAvailableCopies(dto.getAvailableCopies());
        book.setPrice(dto.getPrice());
        book.setCoverImageUrl(dto.getCoverImageUrl());

        if (dto.getActive() != null) {
            book.setActive(dto.getActive());
        }
    }

}
