package com.parking_system.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String message;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "submitted_at", nullable = false)
  private LocalDateTime submittedAt;

  @Column(name = "admin_reply", columnDefinition = "TEXT")
  private String adminReply;

  @Column(name = "status", columnDefinition = "ENUM('open','closed') DEFAULT 'open'")
  private String status = "open";

  @Column(name = "reply", columnDefinition = "TEXT")
  private String reply;

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getSubmittedAt() { return submittedAt; }
  public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

  public String getAdminReply() { return adminReply; }
  public void setAdminReply(String adminReply) { this.adminReply = adminReply; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getReply() { return reply; }
  public void setReply(String reply) { this.reply = reply; }
}
