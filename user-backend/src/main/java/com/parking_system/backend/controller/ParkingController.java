package com.parking_system.backend.controller;

import com.parking_system.backend.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.parking_system.backend.service.ParkingService;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/buildings")
    public ResponseEntity<List<BuildingDto>> getBuildings() {
        return ResponseEntity.ok(parkingService.getAllBuildings());
    }

    @GetMapping("/slots")
    public ResponseEntity<List<SlotDto>> getSlotsByBuilding(@RequestParam Integer buildingId) {
        return ResponseEntity.ok(parkingService.getSlotsByBuilding(buildingId));
    }

    @PostMapping("/verify-key")
    public ResponseEntity<?> verifyKey(@RequestBody KeyVerifyRequest req) {
        String result = parkingService.verifySlotKey(req.getUserId(), req.getSlotId(), req.getKey());
        if ("success".equals(result)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Slot unlocked. Welcome!"));
        } else {
            return ResponseEntity.ok(Map.of("success", false, "message", result));
        }
    }

    @PostMapping("/payment/checkout")
    public ResponseEntity<PaymentKeyResponse> checkoutAndGenerateKey(@RequestBody PaymentRequest req) {
        PaymentKeyResponse resp = parkingService.checkoutAndGenerateKey(req.getParkedId());
        return ResponseEntity.ok(resp);
    }
    @GetMapping("/active/{parkedId}")
    public ResponseEntity<ActiveDto> getActiveById(@PathVariable Integer parkedId) {
        return ResponseEntity.ok(parkingService.getActiveById(parkedId));
    }

    @PostMapping("/cancel")
    public ResponseEntity<Void> cancel(@RequestBody CancelParkRequest req) {
        parkingService.cancelPendingPark(req.getParkedId(), req.getUserId());
        return ResponseEntity.ok().build();
    }

}
