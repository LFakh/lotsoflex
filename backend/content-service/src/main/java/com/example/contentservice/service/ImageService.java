package com.example.contentservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Service
@Slf4j
public class ImageService {

    private final WebClient.Builder webClientBuilder;
    private final RedisTemplate<String, byte[]> redisTemplate;

    @Value("${tmdb.image.base-url}")
    private String imageBaseUrl;

    @Value("${tmdb.image.cache-ttl}")
    private long imageCacheTtl;

    public ImageService(WebClient.Builder webClientBuilder, RedisTemplate<String, byte[]> redisTemplate) {
        this.webClientBuilder = webClientBuilder;
        this.redisTemplate = redisTemplate;
    }

    @Cacheable(value = "images", key = "#path")
    public byte[] getImage(String path, String size) {
        String cacheKey = "image:" + size + ":" + path;
        
        // Check if image is in Redis cache
        byte[] cachedImage = redisTemplate.opsForValue().get(cacheKey);
        if (cachedImage != null) {
            log.debug("Image found in cache: {}", cacheKey);
            return cachedImage;
        }

        // If not in cache, fetch from TMDB
        try {
            log.debug("Fetching image from TMDB: {}", path);
            byte[] imageBytes = webClientBuilder.build()
                    .get()
                    .uri(imageBaseUrl + size + path)
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .block();

            // Cache the image in Redis
            if (imageBytes != null) {
                redisTemplate.opsForValue().set(cacheKey, imageBytes, Duration.ofSeconds(imageCacheTtl));
                log.debug("Image cached: {}", cacheKey);
            }

            return imageBytes;
        } catch (Exception e) {
            log.error("Error fetching image from TMDB: {}", e.getMessage());
            return null;
        }
    }

    public void cacheImage(String path) {
        // Cache different sizes of the image
        String[] sizes = {"w92", "w154", "w185", "w342", "w500", "w780", "original"};
        for (String size : sizes) {
            getImage(path, size);
        }
    }
}