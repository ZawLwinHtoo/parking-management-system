package com.parking_system.backend.controller;

import com.parking_system.backend.dto.SlotDto;
import com.parking_system.backend.service.ParkingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

}
