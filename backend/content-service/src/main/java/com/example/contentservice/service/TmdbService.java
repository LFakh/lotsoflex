package com.example.contentservice.service;

import com.example.contentservice.model.Genre;
import com.example.contentservice.model.Movie;
import com.example.contentservice.repository.GenreRepository;
import com.example.contentservice.repository.MovieRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class TmdbService {

    private final WebClient tmdbWebClient;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ImageService imageService;

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Cacheable(value = "movieDetails", key = "#id")
    public Movie getMovieDetails(Long id) {
        return movieRepository.findById(id)
                .orElseGet(() -> fetchAndSaveMovieFromTmdb(id));
    }

    private Movie fetchAndSaveMovieFromTmdb(Long id) {
        try {
            JsonNode movieData = tmdbWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/{id}")
                            .queryParam("api_key", apiKey)
                            .build(id))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (movieData == null) {
                return null;
            }

            // Cache images if they exist
            if (movieData.has("poster_path") && !movieData.get("poster_path").isNull()) {
                String posterPath = movieData.get("poster_path").asText();
                imageService.cacheImage(posterPath);
            }

            if (movieData.has("backdrop_path") && !movieData.get("backdrop_path").isNull()) {
                String backdropPath = movieData.get("backdrop_path").asText();
                imageService.cacheImage(backdropPath);
            }

            // Parse and save genres
            Set<Genre> genres = new HashSet<>();
            if (movieData.has("genres") && movieData.get("genres").isArray()) {
                for (JsonNode genreNode : movieData.get("genres")) {
                    Long genreId = genreNode.get("id").asLong();
                    String genreName = genreNode.get("name").asText();
                    
                    Genre genre = genreRepository.findById(genreId)
                            .orElse(new Genre(genreId, genreName));
                    
                    genreRepository.save(genre);
                    genres.add(genre);
                }
            }

            // Parse release date
            LocalDate releaseDate = null;
            if (movieData.has("release_date") && !movieData.get("release_date").isNull()) {
                try {
                    String releaseDateStr = movieData.get("release_date").asText();
                    releaseDate = LocalDate.parse(releaseDateStr, DateTimeFormatter.ISO_DATE);
                } catch (DateTimeParseException e) {
                    log.error("Error parsing release date for movie {}: {}", id, e.getMessage());
                }
            }

            // Create and save movie
            Movie movie = Movie.builder()
                    .tmdbId(id)
                    .title(movieData.get("title").asText())
                    .overview(movieData.has("overview") ? movieData.get("overview").asText() : null)
                    .posterPath(movieData.has("poster_path") ? movieData.get("poster_path").asText() : null)
                    .backdropPath(movieData.has("backdrop_path") ? movieData.get("backdrop_path").asText() : null)
                    .releaseDate(releaseDate)
                    .voteAverage(movieData.has("vote_average") ? movieData.get("vote_average").asDouble() : null)
                    .voteCount(movieData.has("vote_count") ? movieData.get("vote_count").asInt() : null)
                    .runtime(movieData.has("runtime") ? movieData.get("runtime").asInt() : null)
                    .genres(genres)
                    .build();

            return movieRepository.save(movie);
        } catch (Exception e) {
            log.error("Error fetching movie details from TMDB for id {}: {}", id, e.getMessage());
            return null;
        }
    }

    @Scheduled(cron = "0 0 1 * * ?") // Run at 1 AM every day
    public void updatePopularMovies() {
        try {
            log.info("Starting scheduled update of popular movies");
            
            JsonNode response = tmdbWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/popular")
                            .queryParam("api_key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (response != null && response.has("results")) {
                for (JsonNode movieNode : response.get("results")) {
                    Long id = movieNode.get("id").asLong();
                    fetchAndSaveMovieFromTmdb(id);
                }
            }
            
            log.info("Completed scheduled update of popular movies");
        } catch (Exception e) {
            log.error("Error during scheduled update of popular movies: {}", e.getMessage());
        }
    }
}