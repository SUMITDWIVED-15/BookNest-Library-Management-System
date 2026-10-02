package com.sumit.bookstore.repository;

import com.sumit.bookstore.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IGenreRepo extends JpaRepository<Genre,Long> {

    List<Genre>findByActiveTrueOrderByDisplayOrderAsc();

    List<Genre> findByParentGenereIsNullAndActiveTrueOrderByDisplayOrderAsc();

    List<Genre> findByParentGenereIdAndActiveTrueOrderByDisplayOrderAsc(Long parentGenreId);



    long countByActiveTrue();

//    @Query("select count(b) from book b where b.genre.id=:genreId")
//    long countBooksByGenre(@Param("genreId") Long genreId);



}
