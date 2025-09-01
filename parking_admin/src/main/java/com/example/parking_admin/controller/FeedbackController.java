package com.example.parking_admin.controller;

import com.example.parking_admin.dto.PageResponse;
import com.example.parking_admin.entity.Feedback;
import com.example.parking_admin.service.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for React frontend
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // GET /api/feedback?status=all|open|resolved|replied&page=1&size=5&dateFilter=all|today|this_week|this_month
    @GetMapping
    public ResponseEntity<PageResponse<Feedback>> getFeedbacks(
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "all") String dateFilter
    ) {
        // Get the date range based on the filter
        LocalDateTime startDate = null;
        LocalDateTime endDate = LocalDateTime.now();

        switch (dateFilter.toLowerCase()) {
            case "today":
                startDate = LocalDateTime.now().toLocalDate().atStartOfDay();
                break;
            case "this_week":
                startDate = LocalDateTime.now().with(DayOfWeek.MONDAY).toLocalDate().atStartOfDay();
                break;
            case "this_month":
                startDate = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
                break;
            case "all":
            default:
                // No start date, get all feedbacks
                startDate = LocalDateTime.MIN;
                break;
        }

        // Fetch the feedbacks with the date filter
        if ("all".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(feedbackService.getFeedbacksByDateFilterAndStatus(status, startDate, endDate, page, size));
        } else {
            return ResponseEntity.ok(feedbackService.getFeedbacksByDateFilterAndStatus(status, startDate, endDate, page, size));
        }
    }

    // GET /api/feedback/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedback(@PathVariable Long id) {
        return feedbackService.getFeedback(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // DELETE /api/feedback/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        return feedbackService.deleteFeedback(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // POST /api/feedback/{id}/reply
    @PostMapping("/{id}/reply")
    public ResponseEntity<Feedback> replyToFeedback(@PathVariable Long id, @RequestBody String reply) {
        if (reply == null || reply.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);  // Return empty body with badRequest status
        }
        Feedback saved = feedbackService.replyToFeedback(id, reply);
        return saved == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(saved);
    }

    // POST /api/feedback/{id}/resolve
    @PostMapping("/{id}/resolve")
    public ResponseEntity<Feedback> resolveFeedback(@PathVariable Long id) {
        Feedback saved = feedbackService.resolveFeedback(id);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    // GET /api/feedback/analytics
    @GetMapping("/analytics")
    public ResponseEntity<List<Map<String, Object>>> getFeedbackAnalytics() {
        return ResponseEntity.ok(feedbackService.getFeedbackAnalytics());
    }

    // GET /api/feedback/common-issues
    @GetMapping("/common-issues")
    public ResponseEntity<List<Map<String, Object>>> getCommonIssues() {
        List<Map<String, Object>> commonIssues = feedbackService.getFeedbackAnalytics();
        return ResponseEntity.ok(commonIssues);
    }
}
