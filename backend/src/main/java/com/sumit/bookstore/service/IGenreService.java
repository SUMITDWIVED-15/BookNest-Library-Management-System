package com.sumit.bookstore.service;

import com.sumit.bookstore.exception.GenreException;
import com.sumit.bookstore.payload.dto.GenreDTO;

import java.util.List;

public interface IGenreService {

    GenreDTO createGenre(GenreDTO genreDTO);

    List<GenreDTO> getAllGenres();

    GenreDTO getGenreBYId(Long GenreId) throws GenreException;

    GenreDTO updateGenre(Long genreId,GenreDTO genre) throws GenreException;

    void deleteGenre(Long genreId) throws GenreException;

    void hardDeleteGenre(Long genreId) throws GenreException;

    List<GenreDTO> getAllActiveGenresWithSubGenres();

    List<GenreDTO> getTopLevelGenres();
//
//    Page<GenreDTO> searchGenres(String searchTerm , Pageable pageable);

    long getTotalActiveGenres();

    long getBookCountByGenre(Long genreId);


}
