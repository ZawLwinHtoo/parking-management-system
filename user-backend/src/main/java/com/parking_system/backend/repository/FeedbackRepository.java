package com.parking_system.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.parking_system.backend.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Spring will auto-implement this based on the method name
    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);
}
