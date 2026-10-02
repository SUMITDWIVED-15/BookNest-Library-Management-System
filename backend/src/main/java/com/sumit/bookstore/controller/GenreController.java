package com.sumit.bookstore.controller;

import com.sumit.bookstore.exception.GenreException;
import com.sumit.bookstore.payload.dto.GenreDTO;
import com.sumit.bookstore.payload.response.ApiResponse;
import com.sumit.bookstore.service.IGenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/genres")
public class GenreController {

    private final IGenreService genreService;

    @PostMapping("/create")
    public ResponseEntity<GenreDTO> addGenre(@RequestBody GenreDTO genre){

        GenreDTO createdGenre = genreService.createGenre(genre);
        return ResponseEntity.ok(createdGenre);
    }

    @GetMapping ("/")
    public ResponseEntity<?> getAllGenre(){

        List<GenreDTO> genres = genreService.getAllGenres();
        return ResponseEntity.ok(genres);

    }

    @GetMapping("/{genreId}")
    public ResponseEntity<?> getGenreById(@PathVariable("genreId") Long genreId)
            throws GenreException {

        GenreDTO genres = genreService.getGenreBYId(genreId);
        return ResponseEntity.ok(genres);
    }

    @PutMapping ("/{genreId}")
    public ResponseEntity<?> updateGenre(
            @PathVariable("genreId") Long genreId,
            @RequestBody GenreDTO genre) throws GenreException {

        GenreDTO genres = genreService.updateGenre(genreId,genre);
        return ResponseEntity.ok(genres);
    }

    @DeleteMapping ("/{genreId}")
    public ResponseEntity<?> deleteGenre(@PathVariable("genreId") Long genreId)
            throws GenreException {
        genreService.deleteGenre(genreId);
        ApiResponse response= new ApiResponse("genre deleted - soft delete",true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping ("/{genreId}/hard")
    public ResponseEntity<?> hardDeleteGenre(@PathVariable("genreId") Long genreId)
            throws GenreException {
        genreService.hardDeleteGenre(genreId);
        ApiResponse response= new ApiResponse("genre deleted - hard delete",true);
        return ResponseEntity.ok(response);
    }

    @GetMapping ("/top-level")
    public ResponseEntity<?> getTopLevelGenres(){

        List<GenreDTO> genres = genreService.getTopLevelGenres();
        return ResponseEntity.ok(genres);

    }

    @GetMapping ("/count")
    public ResponseEntity<?> getTotalActiveGenres(){

        Long genres = genreService.getTotalActiveGenres();
        return ResponseEntity.ok(genres);

    }

    @GetMapping ("/{id}/book-count")
    public ResponseEntity<?> getBookCountGenres(@PathVariable Long id){

        Long count = genreService.getBookCountByGenre(id);
        return ResponseEntity.ok(count);

    }




}
