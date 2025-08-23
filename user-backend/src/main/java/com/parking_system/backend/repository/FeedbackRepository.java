package com.parking_system.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.parking_system.backend.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // use relation path 'user.id'
    List<Feedback> findByUser_IdOrderByCreatedAtDesc(Long userId);

    boolean existsByUser_IdAndStatus(Long userId, String status);

    // check the actual 'reply' column (not adminReply)
    boolean existsByUser_IdAndReplyIsNotNull(Long userId);
}
