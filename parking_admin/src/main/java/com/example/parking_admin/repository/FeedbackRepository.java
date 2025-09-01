package com.example.parking_admin.repository;

import com.example.parking_admin.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find feedbacks by status with pagination
    Page<Feedback> findByStatus(String status, Pageable pageable);

    // Find feedbacks by status and createdAt date range with pagination
    @Query("SELECT f FROM Feedback f WHERE f.createdAt BETWEEN :start AND :end AND LOWER(f.status) = LOWER(:status)")
    Page<Feedback> findByStatusAndCreatedAtBetween(String status, LocalDateTime start, LocalDateTime end, Pageable pageable);

    // New Query for getting feedback analytics based on message frequency
    @Query("SELECT f.message, COUNT(f) FROM Feedback f GROUP BY f.message ORDER BY COUNT(f) DESC")
    List<Object[]> getFeedbackAnalytics();

    // Find feedbacks by createdAt date range (for "all" status scenario)
    @Query("SELECT f FROM Feedback f WHERE f.createdAt BETWEEN :start AND :end")
    Page<Feedback> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
}
