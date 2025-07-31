package com.example.parking_admin.controller;

import com.example.parking_admin.dto.SlotDto;
import com.example.parking_admin.dto.SlotMapper;
import com.example.parking_admin.entity.Building;
import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.repository.BuildingRepository;
import com.example.parking_admin.repository.ParkedCarRepository;
import com.example.parking_admin.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private ParkedCarRepository parkedCarRepository;

    @GetMapping
    public List<SlotDto> getAllSlots() {
        return slotRepository.findAll().stream()
                .map(SlotMapper::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public SlotDto addSlot(@RequestBody SlotDto slotDto) {
        Building building = buildingRepository.findById(slotDto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        // Check if slot count is already 30
        long count = slotRepository.countByBuildingId(building.getId());
        if (count >= 30)
            throw new RuntimeException("Cannot add more than 30 slots to a building!");

        // 1. Check slot number format S1–S30
        if (!slotDto.getSlotNumber().matches("S([1-9]|[12][0-9]|30)")) {
            throw new RuntimeException("Slot number must be S1 to S30");
        }

        // 2. Check if this slot number already exists for this building
        boolean exists = slotRepository.existsBySlotNumberAndBuildingId(
                slotDto.getSlotNumber(), slotDto.getBuildingId()
        );
        if (exists)
            throw new RuntimeException("Slot number already exists for this building!");

        Slot slot = SlotMapper.toEntity(slotDto, building);
        slot.setFloor(SlotMapper.calculateFloorFromSlotNumber(slot.getSlotNumber()));
        Slot saved = slotRepository.save(slot);
        return SlotMapper.toDto(saved);
    }

    @PutMapping("/{id}")
    @Transactional // Make sure this is transactional!
    public SlotDto updateSlot(@PathVariable Long id, @RequestBody SlotDto slotDto) {
        Slot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        Building building = buildingRepository.findById(slotDto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));
        slot.setSlotNumber(slotDto.getSlotNumber());
        slot.setIsOccupied(slotDto.getIsOccupied());
        slot.setSlotType(slotDto.getSlotType());
        slot.setLocation(slotDto.getLocation());
        slot.setBuilding(building);
        slot.setFloor(SlotMapper.calculateFloorFromSlotNumber(slot.getSlotNumber()));

        // 💡 Check if being set to available/unoccupied:
        if (Boolean.FALSE.equals(slotDto.getIsOccupied())) {
            parkedCarRepository.deleteBySlot(slot);
        }

        Slot updated = slotRepository.save(slot);
        return SlotMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteSlot(@PathVariable Long id) {
        slotRepository.deleteById(id);
    }
}
