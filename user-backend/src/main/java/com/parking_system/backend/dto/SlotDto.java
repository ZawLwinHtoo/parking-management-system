package com.parking_system.backend.dto;

import com.parking_system.backend.model.SlotType;
import lombok.Data;

@Data
public class SlotDto {
    private Integer id;
    private String slotNumber;
    private boolean isOccupied;
    private String slotType; // for frontend display, if needed

    public SlotDto(Integer id, String slotNumber, String slotType, Boolean isOccupied) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.slotType = slotType;
        this.isOccupied = isOccupied;
    }
}
