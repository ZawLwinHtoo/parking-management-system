package com.example.parking_admin.dto;

import com.example.parking_admin.entity.Building;
import com.example.parking_admin.entity.Slot;

public class SlotMapper {
    public static SlotDto toDto(Slot slot) {
        SlotDto dto = new SlotDto();
        dto.setId(slot.getId());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setIsOccupied(slot.getIsOccupied());
        dto.setSlotType(slot.getSlotType());
        dto.setLocation(slot.getLocation());
        dto.setIsAvailable(slot.getIsAvailable());
        if (slot.getBuilding() != null) {
            dto.setBuildingId(slot.getBuilding().getId());
            dto.setBuildingName(slot.getBuilding().getName());
        }
        return dto;
    }

    public static Slot toEntity(SlotDto dto, Building building) {
        Slot slot = new Slot();
        slot.setId(dto.getId());
        slot.setSlotNumber(dto.getSlotNumber());
        slot.setIsOccupied(dto.getIsOccupied());
        slot.setSlotType(dto.getSlotType());
        slot.setLocation(dto.getLocation());
        slot.setIsAvailable(dto.getIsAvailable());
        slot.setBuilding(building);
        return slot;
    }
}
