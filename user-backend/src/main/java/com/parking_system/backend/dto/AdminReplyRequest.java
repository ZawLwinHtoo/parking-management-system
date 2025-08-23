// com.parking_system.backend.dto.AdminReplyRequest
package com.parking_system.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AdminReplyRequest {
    private String adminReply; // primary
    private String status;

    public String getAdminReply() { return adminReply; }
    public void setAdminReply(String adminReply) { this.adminReply = adminReply; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Accept JSON payloads that send { "reply": "..." } instead of { "adminReply": "..." }
    @JsonProperty("reply")
    public void setReplyAlias(String reply) { this.adminReply = reply; }
}
