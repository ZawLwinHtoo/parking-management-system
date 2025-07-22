package com.parking_system.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class HistoryDto {
    private Integer parkedId;
    private String carNumber;
    private String slotNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private BigDecimal fee;
}