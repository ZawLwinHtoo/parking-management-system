package com.example.parking_admin.controller;

import com.example.parking_admin.dto.BuildingDto;
import com.example.parking_admin.entity.Building;
import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.repository.BuildingRepository;
import com.example.parking_admin.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @GetMapping
    public List<BuildingDto> getAllBuildings() {
        return buildingRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public BuildingDto addBuilding(@RequestBody BuildingDto buildingDto) {
        if (buildingRepository.existsByNameIgnoreCase(buildingDto.getName())) {
            throw new RuntimeException("Building name already exists!");
        }
        Building b = new Building();
        b.setName(buildingDto.getName());
        b.setLocation(buildingDto.getLocation());
        b.setAddress(buildingDto.getAddress());

        Building saved = buildingRepository.save(b);

        // Auto-create 30 slots
        for (int i = 1; i <= 30; i++) {
            Slot slot = new Slot();
            slot.setBuilding(saved);
            slot.setSlotNumber("S" + i); // Naming pattern: S1, S2, ..., S30
            slot.setSlotType("medium");
            slot.setIsOccupied(false);
            slot.setIsAvailable(true);
            slot.setLocation("");
            slot.setFloor((i - 1) / 10 + 1); // <-- This sets floor 1,2,3
            slotRepository.save(slot);
        }

        return toDto(saved);
    }

    @PutMapping("/{id}")
    public BuildingDto updateBuilding(@PathVariable Long id, @RequestBody BuildingDto buildingDto) {
        Building b = buildingRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        b.setName(buildingDto.getName());
        b.setLocation(buildingDto.getLocation());
        b.setAddress(buildingDto.getAddress());
        return toDto(buildingRepository.save(b));
    }

    @DeleteMapping("/{id}")
    public void deleteBuilding(@PathVariable Long id) {
        buildingRepository.deleteById(id);
    }

    private BuildingDto toDto(Building b) {
        BuildingDto dto = new BuildingDto();
        dto.setId(b.getId());
        dto.setName(b.getName());
        dto.setLocation(b.getLocation());
        dto.setAddress(b.getAddress());
        return dto;
    }
}
