package com.example.parking_admin.dto;

import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.entity.Building;

public class SlotMapper {
    public static SlotDto toDto(Slot slot) {
        SlotDto dto = new SlotDto();
        dto.setId(slot.getId());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setIsOccupied(slot.getIsOccupied());
        dto.setSlotType(slot.getSlotType());
        dto.setLocation(slot.getLocation());
        //dto.setIsAvailable(slot.getIsAvailable());
        dto.setBuildingId(slot.getBuilding() != null ? slot.getBuilding().getId() : null);
        dto.setBuildingName(slot.getBuilding() != null ? slot.getBuilding().getName() : null);
        dto.setFloor(slot.getFloor());
        return dto;
    }

    public static Slot toEntity(SlotDto dto, Building building) {
        Slot slot = new Slot();
        slot.setId(dto.getId());
        slot.setSlotNumber(dto.getSlotNumber());
        slot.setIsOccupied(dto.getIsOccupied());
        slot.setSlotType(dto.getSlotType());
        slot.setLocation(dto.getLocation());
        //slot.setIsAvailable(dto.getIsAvailable());
        slot.setFloor(dto.getFloor());
        slot.setBuilding(building);
        return slot;
    }
    public static int calculateFloorFromSlotNumber(String slotNumber) {
        try {
            int num = Integer.parseInt(slotNumber.substring(1));
            if (num >= 1 && num <= 10) return 1;
            if (num >= 11 && num <= 20) return 2;
            if (num >= 21 && num <= 30) return 3;
        } catch (Exception e) {}
        return 1; // fallback
    }

}
