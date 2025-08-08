package com.parking_system.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @PostMapping("/feedback")
    public ResponseEntity<String> testFeedback(@RequestBody String feedbackMessage) {
        return ResponseEntity.ok("Test feedback received: " + feedbackMessage);
    }
}

