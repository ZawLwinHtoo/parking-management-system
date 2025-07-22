package com.parking_system.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActiveDto {
    private Integer parkedId;
    private String carNumber;
    private String slotNumber;
    private LocalDateTime entryTime;
}