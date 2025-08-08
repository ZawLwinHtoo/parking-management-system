package com.parking_system.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parking_system.backend.dto.AdminReplyRequest;
import com.parking_system.backend.dto.FeedbackRequest;
import com.parking_system.backend.model.Feedback;
import com.parking_system.backend.repository.FeedbackRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Feedback create(FeedbackRequest req) {
        Feedback f = new Feedback();
        f.setUserId(req.getUserId());
        f.setMessage(req.getMessage());

        LocalDateTime now = LocalDateTime.now();
        f.setCreatedAt(now);
        f.setSubmittedAt(now);
        f.setStatus("open");

        return repo.save(f);
    }

    @Transactional(readOnly = true)
    public List<Feedback> findByUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Feedback adminReply(Long id, AdminReplyRequest req) {
        Feedback f = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        f.setAdminReply(req.getAdminReply());
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
