package com.example.parking_admin.controller;

import com.example.parking_admin.dto.SlotDto;
import com.example.parking_admin.dto.SlotMapper;
import com.example.parking_admin.entity.Building;
import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.repository.BuildingRepository;
import com.example.parking_admin.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BuildingRepository buildingRepository;

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
        Slot slot = SlotMapper.toEntity(slotDto, building);
        Slot saved = slotRepository.save(slot);
        return SlotMapper.toDto(saved);
    }

    @PutMapping("/{id}")
    public SlotDto updateSlot(@PathVariable Long id, @RequestBody SlotDto slotDto) {
        Slot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        Building building = buildingRepository.findById(slotDto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));
        slot.setSlotNumber(slotDto.getSlotNumber());
        slot.setIsOccupied(slotDto.getIsOccupied());
        slot.setSlotType(slotDto.getSlotType());
        slot.setLocation(slotDto.getLocation());
        slot.setIsAvailable(slotDto.getIsAvailable());
        slot.setBuilding(building);
        Slot updated = slotRepository.save(slot);
        return SlotMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteSlot(@PathVariable Long id) {
        slotRepository.deleteById(id);
    }
}
