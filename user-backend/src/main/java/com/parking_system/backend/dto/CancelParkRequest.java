// dto/CancelParkRequest.java
package com.parking_system.backend.dto;

public class CancelParkRequest {
    private Integer parkedId;
    private Integer userId; // for extra safety (optional)

    public Integer getParkedId() { return parkedId; }
    public void setParkedId(Integer parkedId) { this.parkedId = parkedId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
