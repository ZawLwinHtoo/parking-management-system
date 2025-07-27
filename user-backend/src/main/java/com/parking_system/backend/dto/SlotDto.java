package com.parking_system.backend.dto;

import com.parking_system.backend.model.SlotType;
import lombok.Data;

@Data
public class SlotDto {
    private Integer id;
    private String slotNumber;
    private boolean isOccupied;
    private String slotType; // for frontend display, if needed
    private Integer floor;

    public SlotDto(Integer id, String slotNumber, String slotType, Boolean isOccupied, Integer floor) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.slotType = slotType;
        this.isOccupied = isOccupied;
        this.floor = floor;
    }
}
