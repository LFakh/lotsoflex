package com.example.recommendationservice.service;

import com.example.recommendationservice.model.UserActivity;
import com.example.recommendationservice.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final UserActivityRepository userActivityRepository;
    private final WebClient.Builder webClientBuilder;

    public void recordActivity(UUID userId, Long movieId, UserActivity.ActivityType activityType) {
        UserActivity activity = UserActivity.builder()
                .userId(userId)
                .movieId(movieId)
                .activityType(activityType)
                .build();
        
        userActivityRepository.save(activity);
    }

    @Cacheable(value = "userRecommendations", key = "#userId")
    public List<Long> getRecommendedMovies(UUID userId) {
        // Get user's liked movies
        List<Long> likedMovies = userActivityRepository.findLikedMovieIds(userId);
        
        // Get similar movies based on user's liked movies
        List<Long> recommendations = new ArrayList<>();
        
        // In a real implementation, we would call a machine learning service
        // or use a recommendation algorithm to get similar movies
        // For now, we'll just return a simple list based on liked movies
        
        if (!likedMovies.isEmpty()) {
            // For each liked movie, get similar movies from content service
            for (Long movieId : likedMovies) {
                try {
                    List<Long> similarMovies = webClientBuilder.build()
                            .get()
                            .uri("http://content-service/api/content/movies/{id}/similar", movieId)
                            .retrieve()
                            .bodyToFlux(Long.class)
                            .collectList()
                            .block();
                    
                    if (similarMovies != null) {
                        recommendations.addAll(similarMovies);
                    }
                } catch (Exception e) {
                    log.error("Error fetching similar movies for movie {}: {}", movieId, e.getMessage());
                }
            }
        }
        
        // If we don't have enough recommendations, add trending movies
        if (recommendations.size() < 20) {
            try {
                List<Long> trendingMovies = webClientBuilder.build()
                        .get()
                        .uri("http://content-service/api/content/movies/trending")
                        .retrieve()
                        .bodyToFlux(Long.class)
                        .collectList()
                        .block();
                
                if (trendingMovies != null) {
                    recommendations.addAll(trendingMovies);
                }
            } catch (Exception e) {
                log.error("Error fetching trending movies: {}", e.getMessage());
            }
        }
        
        return recommendations.subList(0, Math.min(recommendations.size(), 20));
    }

    public List<Long> getRecentlyWatched(UUID userId) {
        return userActivityRepository.findRecentlyWatchedMovieIds(userId);
    }

    public List<Long> getMyList(UUID userId) {
        return userActivityRepository.findMyListMovieIds(userId);
    }
}