package com.example.parking_admin.controller;

import com.example.parking_admin.entity.ParkedCar;
import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.entity.User;
import com.example.parking_admin.dto.ParkedCarDto;
import com.example.parking_admin.repository.ParkedCarRepository;
import com.example.parking_admin.repository.UserRepository;
import com.example.parking_admin.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private ParkedCarRepository parkedCarRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SlotRepository slotRepository;

    // GET all sessions as DTOs
    @GetMapping
    public List<ParkedCarDto> getAllSessions() {
        return parkedCarRepository.findAll().stream().map(pc -> {
            String entryTime = pc.getEntryTime() != null ? pc.getEntryTime().toString() : "";
            String exitTime = pc.getExitTime() != null ? pc.getExitTime().toString() : "";
            String userName = (pc.getUser() != null) ?
                    (pc.getUser().getFullName() != null && !pc.getUser().getFullName().isEmpty()
                            ? pc.getUser().getFullName() : pc.getUser().getUsername())
                    : "";
            String slotNumber = (pc.getSlot() != null && pc.getSlot().getSlotNumber() != null)
                    ? pc.getSlot().getSlotNumber() : "";
            String building = (pc.getSlot() != null && pc.getSlot().getBuilding() != null)
                    ? pc.getSlot().getBuilding().getName() : "";
            return new ParkedCarDto(
                    pc.getId(),
                    pc.getCarNumber(),
                    userName,
                    slotNumber,
                    building,
                    entryTime,
                    exitTime,
                    pc.getFee(),
                    (pc.getUser() != null) ? pc.getUser().getId() : null,
                    (pc.getSlot() != null) ? pc.getSlot().getId() : null
            );
        }).toList();
    }

    // Get a single session by ID (returns the raw entity, not the DTO)
    @GetMapping("/{id}")
    public ParkedCar getSession(@PathVariable Long id) {
        return parkedCarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    // End a session (set exit_time)
    @PutMapping("/{id}/end")
    public ParkedCar endSession(@PathVariable Long id) {
        ParkedCar pc = parkedCarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        if (pc.getExitTime() == null) {
            pc.setExitTime(LocalDateTime.now());
        }
        return parkedCarRepository.save(pc);
    }

    // --- THIS IS THE FULL "EDIT" ENDPOINT ---
    @PutMapping("/{id}")
    public ParkedCar editSession(@PathVariable Long id, @RequestBody ParkedCarDto dto) {
        ParkedCar pc = parkedCarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Update basic fields
        pc.setCarNumber(dto.carNumber);
        pc.setFee(dto.fee);

        if (dto.entryTime != null && !dto.entryTime.isEmpty())
            pc.setEntryTime(LocalDateTime.parse(dto.entryTime));
        if (dto.exitTime != null && !dto.exitTime.isEmpty())
            pc.setExitTime(LocalDateTime.parse(dto.exitTime));

        // Update slot if new slotId is provided
        if (dto.slotId != null) {
            Slot slot = slotRepository.findById(dto.slotId).orElse(null);
            pc.setSlot(slot);
        }

        // Update user if new userId is provided
        if (dto.userId != null) {
            User user = userRepository.findById(dto.userId).orElse(null);
            pc.setUser(user);
        }

        return parkedCarRepository.save(pc);
    }

    // DELETE a session
    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        parkedCarRepository.deleteById(id);
    }
}
