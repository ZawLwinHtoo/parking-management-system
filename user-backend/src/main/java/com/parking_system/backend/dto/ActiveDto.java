package com.parking_system.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActiveDto {
    private Integer parkedId;
    private String carNumber;
    private String slotNumber;
    private String buildingName; // <-- Add this!
    private LocalDateTime entryTime;
    private String key;
    private Integer slotId;
    private Integer userId;                 // Add this line
    private java.math.BigDecimal fee;       // And this line

    public void setParkedId(Integer parkedId) {
        this.parkedId = parkedId;
    }

    public void setCarNumber(String carNumber) {
        this.carNumber = carNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public void setKey(String key) {
        this.key = key;
    }
    public Integer getSlotId() {
        return slotId;
    }

    public void setSlotId(Integer slotId) {
        this.slotId = slotId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public java.math.BigDecimal getFee() {
        return fee;
    }

    public void setFee(java.math.BigDecimal fee) {
        this.fee = fee;
    }
}
