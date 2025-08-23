package com.parking_system.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.parking_system.backend.dto.AdminReplyRequest;
import com.parking_system.backend.dto.FeedbackRequest;
import com.parking_system.backend.model.Feedback;
import com.parking_system.backend.model.User;
import com.parking_system.backend.repository.FeedbackRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Feedback create(FeedbackRequest req) {
        if (req == null || req.getUserId() == null || req.getMessage() == null || req.getMessage().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId and message are required");
        }

        Feedback f = new Feedback();
        // set relation (no userId field on Feedback)
        f.setUser(new User(req.getUserId().intValue())); // use appropriate ctor type for your User id
        f.setMessage(req.getMessage().trim());
        f.setStatus("open");

        LocalDateTime now = LocalDateTime.now();
        f.setCreatedAt(now);
        f.setSubmittedAt(now);

        return repo.save(f);
    }

    @Transactional(readOnly = true)
    public List<Feedback> findByUser(Long userId) {
        if (userId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        return repo.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Feedback adminReply(Long id, AdminReplyRequest req) {
        Feedback f = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found"));

        if (req == null || req.getAdminReply() == null || req.getAdminReply().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "adminReply is required");
        }

        // write into the single 'reply' column on Feedback
        f.setReply(req.getAdminReply().trim());

        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            f.setStatus(req.getStatus());
        }
        return repo.save(f);
    }

    @Transactional(readOnly = true)
    public List<Feedback> findAll() {
        return repo.findAll();
    }
}
