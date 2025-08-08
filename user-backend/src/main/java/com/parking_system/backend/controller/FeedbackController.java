package com.parking_system.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.parking_system.backend.dto.FeedbackRequest;
import com.parking_system.backend.model.Feedback;
import com.parking_system.backend.service.FeedbackService;

@RestController
@RequestMapping("/api/parking/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // POST method to create feedback
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody FeedbackRequest req) {
        Feedback feedback = feedbackService.create(req);
        return ResponseEntity.ok(feedback);
    }

    // GET method to fetch feedback by userId
    @GetMapping
    public ResponseEntity<List<Feedback>> getFeedbackByUser(@RequestParam Long userId) {
        List<Feedback> feedbackList = feedbackService.findByUser(userId);
        return ResponseEntity.ok(feedbackList);
    }
}


