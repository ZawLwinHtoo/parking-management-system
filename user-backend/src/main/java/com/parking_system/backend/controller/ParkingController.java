package com.parking_system.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.parking_system.backend.dto.ParkRequest;
import com.parking_system.backend.dto.UnparkRequest;
import com.parking_system.backend.dto.ActiveDto;
import com.parking_system.backend.dto.HistoryDto;
import com.parking_system.backend.service.ParkingService;
import java.util.List;

@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "http://localhost:5173")
public class ParkingController {

    private final ParkingService parkingService;
    public ParkingController(ParkingService svc) { this.parkingService = svc; }

    @PostMapping("/park")
    public ResponseEntity<ActiveDto> park(@RequestBody ParkRequest req) {
        ActiveDto result = parkingService.park(req);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/unpark")
    public ResponseEntity<HistoryDto> unpark(@RequestBody UnparkRequest req) {
        HistoryDto result = parkingService.unpark(req);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status")
    public ResponseEntity<List<ActiveDto>> status(@RequestParam Integer userId) {
        return ResponseEntity.ok(parkingService.getActiveStatus(userId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<HistoryDto>> history(@RequestParam Integer userId) {
        return ResponseEntity.ok(parkingService.getHistory(userId));
    }
}
