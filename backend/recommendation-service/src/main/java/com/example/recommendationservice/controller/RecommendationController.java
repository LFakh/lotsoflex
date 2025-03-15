package com.example.recommendationservice.controller;

import com.example.recommendationservice.model.UserActivity;
import com.example.recommendationservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Long>> getRecommendations(@PathVariable UUID userId) {
        return ResponseEntity.ok(recommendationService.getRecommendedMovies(userId));
    }

    @GetMapping("/{userId}/recently-watched")
    public ResponseEntity<List<Long>> getRecentlyWatched(@PathVariable UUID userId) {
        return ResponseEntity.ok(recommendationService.getRecentlyWatched(userId));
    }

    @GetMapping("/{userId}/my-list")
    public ResponseEntity<List<Long>> getMyList(@PathVariable UUID userId) {
        return ResponseEntity.ok(recommendationService.getMyList(userId));
    }

    @PostMapping("/{userId}/activity")
    public ResponseEntity<Void> recordActivity(
            @PathVariable UUID userId,
            @RequestParam Long movieId,
            @RequestParam UserActivity.ActivityType activityType) {
        recommendationService.recordActivity(userId, movieId, activityType);
        return ResponseEntity.ok().build();
    }
}