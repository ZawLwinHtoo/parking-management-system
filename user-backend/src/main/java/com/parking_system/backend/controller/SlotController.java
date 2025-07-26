package com.parking_system.backend.controller;

import com.parking_system.backend.dto.SlotDto;
import com.parking_system.backend.dto.ParkRequest;
import com.parking_system.backend.dto.KeyVerifyRequest;
import com.parking_system.backend.dto.ActiveDto;
import com.parking_system.backend.service.ParkingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slot")
@CrossOrigin(origins = "http://localhost:5173")
public class SlotController {

    private final ParkingService parkingService;

    public SlotController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping("/building/{buildingId}")
    public List<SlotDto> getSlotsByBuilding(@PathVariable Integer buildingId) {
        return parkingService.getSlotsByBuilding(buildingId);
    }

    // Reserve slot and generate key (returns ActiveDto)
    @PostMapping("/park")
    public ResponseEntity<ActiveDto> park(@RequestBody ParkRequest request) {
        ActiveDto result = parkingService.park(request);
        return ResponseEntity.ok(result);
    }

    // Verify key for slot entry
    @PostMapping("/verify-key")
    public ResponseEntity<?> verifyKey(@RequestBody KeyVerifyRequest request) {
        String result = parkingService.verifySlotKey(request.getUserId(), request.getSlotId(), request.getKey());
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Slot unlocked. Welcome!"));
        } else {
            return ResponseEntity.ok(Map.of("success", false, "message", result));
        }
    }
}
