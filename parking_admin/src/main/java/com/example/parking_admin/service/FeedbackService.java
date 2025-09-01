package com.example.parking_admin.service;

import com.example.parking_admin.dto.PageResponse;
import com.example.parking_admin.entity.Feedback;
import com.example.parking_admin.repository.FeedbackRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    // Fetch feedbacks with pagination and status filtering
    public PageResponse<Feedback> getFeedbacksByStatusWithPagination(String status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1));
        Page<Feedback> p;

        // If status is 'all', fetch all feedbacks without filtering by status.
        if ("all".equalsIgnoreCase(status)) {
            p = feedbackRepository.findAll(pageable);
        } else {
            p = feedbackRepository.findByStatus(status, pageable);
        }

        return new PageResponse<>(
                p.getContent(),
                p.getTotalElements(),
                p.getTotalPages(),
                page,
                size
        );
    }

    // Fetch feedbacks with status and date range filtering
    public PageResponse<Feedback> getFeedbacksByDateFilterAndStatus(String status, LocalDateTime start, LocalDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1));

        Page<Feedback> feedbackPage;
        
        if ("all".equalsIgnoreCase(status)) {
            feedbackPage = feedbackRepository.findByCreatedAtBetween(start, end, pageable); // No status filter for 'all'
        } else {
            feedbackPage = feedbackRepository.findByStatusAndCreatedAtBetween(status, start, end, pageable);
        }

        return new PageResponse<>(
                feedbackPage.getContent(),
                feedbackPage.getTotalElements(),
                feedbackPage.getTotalPages(),
                page,
                size
        );
    }

    public Optional<Feedback> getFeedback(Long id) {
        return feedbackRepository.findById(id);
    }

    public boolean deleteFeedback(Long id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Feedback replyToFeedback(Long id, String reply) {
        return feedbackRepository.findById(id).map(fb -> {
            fb.setReply(reply);
            fb.setStatus("replied");
            return feedbackRepository.save(fb);
        }).orElse(null);
    }

    public Feedback resolveFeedback(Long id) {
        return feedbackRepository.findById(id).map(fb -> {
            fb.setStatus("resolved");
            return feedbackRepository.save(fb);
        }).orElse(null);
    }

    // Fetch common issues from feedbacks
    public List<Map<String, Object>> getFeedbackAnalytics() {
        List<Feedback> feedbackList = feedbackRepository.findAll(); // Get all feedbacks

        // Process common issues dynamically
        Map<String, Integer> issueCountMap = new HashMap<>();
        List<String> keywords = Arrays.asList(
                "clean", "slot", "helpful", "payment", "sensor", "ac", "bench", "access card", 
                "yoga", "lighting", "trainer", "dispenser", "playground"
        );

        for (Feedback feedback : feedbackList) {
            String message = feedback.getMessage().toLowerCase();
            for (String keyword : keywords) {
                if (message.contains(keyword)) {
                    issueCountMap.put(keyword, issueCountMap.getOrDefault(keyword, 0) + 1);
                }
            }
        }

        // Convert map to list of results to return to frontend
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : issueCountMap.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("issue", entry.getKey());
            map.put("count", entry.getValue());
            result.add(map);
        }

        // Sort issues by frequency
        result.sort((a, b) -> (int) b.get("count") - (int) a.get("count"));

        return result;
    }
}
