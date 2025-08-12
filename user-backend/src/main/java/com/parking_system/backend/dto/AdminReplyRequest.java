package com.parking_system.backend.dto;

public class AdminReplyRequest {
    private String adminReply;
  private String status; // "open" | "closed"
  public String getAdminReply() { return adminReply; }
  public void setAdminReply(String adminReply) { this.adminReply = adminReply; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}
