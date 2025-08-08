package com.parking_system.backend.dto;

public class FeedbackRequest {
    private Long userId;   // from frontend
  private String message;

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
    
}
