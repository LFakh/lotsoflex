package com.example.recommendationservice.repository;

import com.example.recommendationservice.model.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    
    List<UserActivity> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    @Query("SELECT ua.movieId FROM UserActivity ua WHERE ua.userId = :userId AND ua.activityType = 'WATCH' ORDER BY ua.createdAt DESC")
    List<Long> findRecentlyWatchedMovieIds(UUID userId);
    
    @Query("SELECT ua.movieId FROM UserActivity ua WHERE ua.userId = :userId AND ua.activityType = 'LIKE' ORDER BY ua.createdAt DESC")
    List<Long> findLikedMovieIds(UUID userId);
    
    @Query("SELECT ua.movieId FROM UserActivity ua WHERE ua.userId = :userId AND ua.activityType = 'ADD_TO_LIST' ORDER BY ua.createdAt DESC")
    List<Long> findMyListMovieIds(UUID userId);
}