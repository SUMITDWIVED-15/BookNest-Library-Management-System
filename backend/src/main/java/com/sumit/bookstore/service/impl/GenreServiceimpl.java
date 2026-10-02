package com.sumit.bookstore.service.impl;

import com.sumit.bookstore.exception.GenreException;
import com.sumit.bookstore.mapper.GenreMapper;
import com.sumit.bookstore.model.Genre;
import com.sumit.bookstore.payload.dto.GenreDTO;
import com.sumit.bookstore.repository.IGenreRepo;
import com.sumit.bookstore.service.IGenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreServiceimpl implements IGenreService {

    private final IGenreRepo genreRepo;
    private final GenreMapper genreMapper;

    @Override
    public GenreDTO createGenre(GenreDTO genreDTO) {

        Genre genre = genreMapper.toEntity(genreDTO);
        Genre savedGenre = genreRepo.save(genre);

        return genreMapper.toDTO(savedGenre);

    }

    @Override
    public List<GenreDTO> getAllGenres() {
        return genreRepo.findAll().stream()
                .map(genreMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GenreDTO getGenreBYId(Long genreId) throws GenreException {
        Genre genre = genreRepo.findById(genreId).orElseThrow(
                ()-> new GenreException("genre not found")
        );
        return genreMapper.toDTO(genre);
    }

    @Override
    public GenreDTO updateGenre(Long genreId, GenreDTO genreDTO) throws GenreException {
        Genre existingGenre = genreRepo.findById(genreId).orElseThrow(
                ()-> new GenreException("genre not found")
        );
        genreMapper.updateEntityFromDTO(genreDTO,existingGenre);
        Genre updateGenre= genreRepo.save(existingGenre);

        return genreMapper.toDTO(updateGenre);
    }

    @Override
    public void deleteGenre(Long genreId) throws GenreException {
        Genre existingGenre = genreRepo.findById(genreId).orElseThrow(
                ()-> new GenreException("genre not found")
        );
        existingGenre.setActive(false);
        genreRepo.save(existingGenre);


    }

    @Override
    public void hardDeleteGenre(Long genreId) throws GenreException {
        Genre existingGenre = genreRepo.findById(genreId).orElseThrow(
                ()-> new GenreException("genre not found")
        );

        genreRepo.delete(existingGenre);

    }

    @Override
    public List<GenreDTO> getAllActiveGenresWithSubGenres() {
        List<Genre> topLevelGenres= genreRepo
                .findByParentGenereIsNullAndActiveTrueOrderByDisplayOrderAsc();


        return genreMapper.toDTOList(topLevelGenres);
    }

    @Override
    public List<GenreDTO> getTopLevelGenres() {
        List<Genre> topLevelGenres= genreRepo
                .findByParentGenereIsNullAndActiveTrueOrderByDisplayOrderAsc();

        return genreMapper.toDTOList(topLevelGenres);

    }
//
//    @Override
//    public Page<GenreDTO> searchGenres(String searchTerm, Pageable pageable) {
//        return null;
//    }

    @Override
    public long getTotalActiveGenres() {
        return genreRepo.countByActiveTrue();
    }

    @Override
    public long getBookCountByGenre(Long genreId) {
        return 0;
    }
}
