package com.example.contentservice.controller;

import com.example.contentservice.model.Movie;
import com.example.contentservice.repository.MovieRepository;
import com.example.contentservice.service.ImageService;
import com.example.contentservice.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;
    private final ImageService imageService;

    @GetMapping
    public ResponseEntity<Page<Movie>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(movieRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        Movie movie = tmdbService.getMovieDetails(id);
        if (movie != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Movie>> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(movieRepository.findByTitleContainingIgnoreCase(query, pageable));
    }

    @GetMapping("/genre/{genreId}")
    public ResponseEntity<Page<Movie>> getMoviesByGenre(
            @PathVariable Long genreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(movieRepository.findByGenreId(genreId, pageable));
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<Movie>> getTrendingMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(movieRepository.findByOrderByVoteAverageDesc(pageable));
    }

    @GetMapping("/latest")
    public ResponseEntity<Page<Movie>> getLatestMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(movieRepository.findByOrderByReleaseDateDesc(pageable));
    }

    @GetMapping("/image")
    public ResponseEntity<byte[]> getImage(
            @RequestParam String path,
            @RequestParam(defaultValue = "original") String size) {
        byte[] imageBytes = imageService.getImage(path, size);
        if (imageBytes != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}