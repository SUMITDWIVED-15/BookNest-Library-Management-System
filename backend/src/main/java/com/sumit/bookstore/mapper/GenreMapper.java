package com.sumit.bookstore.mapper;

import com.sumit.bookstore.model.Genre;
import com.sumit.bookstore.payload.dto.GenreDTO;
import com.sumit.bookstore.repository.IGenreRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GenreMapper {

    private final IGenreRepo genreRepo;

    public GenreDTO toDTO(Genre savedGenre) {

        if (savedGenre == null) {
            return null;
        }

        GenreDTO dto = GenreDTO.builder()
                .id(savedGenre.getId())
                .code(savedGenre.getCode())
                .name(savedGenre.getName())
                .description(savedGenre.getDescription())
                .displayOrder(savedGenre.getDisplayOrder())
                .active(savedGenre.getActive())
                .createdAt(savedGenre.getCreatedAt())
                .updatedAt(savedGenre.getUpdatedAt())
                .build();

        if (savedGenre.getParentGenere() != null) {
            dto.setParentGenreId(savedGenre.getParentGenere().getId());
            dto.setParentGenreName(savedGenre.getParentGenere().getName());

        }

        if (savedGenre.getSubGenres() != null && !savedGenre.getSubGenres().isEmpty()) {

            dto.setSubGenre(savedGenre.getSubGenres().stream()
                    .filter(subGenre -> subGenre.getActive())
                    .map(subGenre -> toDTO(subGenre)).collect(Collectors.toList()));
        }

//        dto.setBookCount(long)

        return dto;
    }

    public Genre toEntity(GenreDTO genreDTO) {

        if (genreDTO == null) {
            return null;
        }

        Genre genre = Genre.builder()
                .code(genreDTO.getCode())
                .name(genreDTO.getName())
                .description(genreDTO.getDescription())
                .displayOrder(genreDTO.getDisplayOrder())
                .active(true)
                .build();

        if (genreDTO.getParentGenreId() != null) {
            genreRepo.findById(genreDTO.getParentGenreId())
                    .ifPresent(genre::setParentGenere);

        }

        return genre;
    }

    public void updateEntityFromDTO(GenreDTO dto, Genre existingGenre) {
        if (dto == null || existingGenre == null) {
            return;
        }

        existingGenre.setCode(dto.getCode());
        existingGenre.setName(dto.getName());
        existingGenre.setDescription(dto.getDescription());
        existingGenre.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        if (dto.getActive() != null) {
            existingGenre.setActive(dto.getActive());
        }
        if (dto.getParentGenreId() != null) {
            genreRepo.findById(dto.getParentGenreId())
                    .ifPresent(existingGenre::setParentGenere);
        }
    }

    public List<GenreDTO> toDTOList(List<Genre> genreList){
        return genreList.stream().map(genre-> toDTO(genre)).collect(Collectors.toList());
    }
}


