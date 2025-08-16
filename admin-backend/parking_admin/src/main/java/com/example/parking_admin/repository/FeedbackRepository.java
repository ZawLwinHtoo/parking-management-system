package com.example.parking_admin.repository;

import com.example.parking_admin.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByStatus(String status, Pageable pageable);

    @Query("SELECT f.message, COUNT(f) FROM Feedback f GROUP BY f.message ORDER BY COUNT(f) DESC")
    List<Object[]> getFeedbackAnalytics();
}
