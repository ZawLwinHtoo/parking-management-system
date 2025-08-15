package com.parking_system.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.parking_system.backend.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);

    // ✅ add this to match your current service call
    boolean existsByUserIdAndStatus(Long userId, String status);

    // ✅ optional: simpler signal “has any admin reply at all”
    boolean existsByUserIdAndAdminReplyIsNotNull(Long userId);
}
