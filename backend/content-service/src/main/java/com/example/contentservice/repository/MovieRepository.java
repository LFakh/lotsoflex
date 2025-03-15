package com.example.contentservice.repository;

import com.example.contentservice.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.id = :genreId")
    Page<Movie> findByGenreId(Long genreId, Pageable pageable);
    
    Page<Movie> findByOrderByReleaseDateDesc(Pageable pageable);
    
    Page<Movie> findByOrderByVoteAverageDesc(Pageable pageable);
}