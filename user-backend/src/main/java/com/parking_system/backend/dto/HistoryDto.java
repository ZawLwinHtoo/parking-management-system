package com.parking_system.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class HistoryDto {
    private Integer parkedId;
    private String carNumber;
    private String slotNumber;
    private String buildingName; // <-- Add this!
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private BigDecimal fee;
}
