package com.parking_system.backend.service;

import com.parking_system.backend.dto.*;
import com.parking_system.backend.model.*;
import com.parking_system.backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.*;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class ParkingServiceImpl implements ParkingService {

    @Autowired private SlotRepository slotRepo;
    @Autowired private ParkedCarRepository parkedCarRepo;
    @Autowired private ParkingRateRepository rateRepo;
    @Autowired private PaymentRepository paymentRepo;
    @Autowired private BuildingRepository buildingRepo;
    @Autowired private SlotKeyRepository slotKeyRepo;

    // PARK: generate one-time key and attach to ActiveDto
    @Override
    @Transactional
    public ActiveDto park(ParkRequest req) {
        // Defensive check: Prevent double parking
        if (parkedCarRepo.findByCarNumberAndExitTimeIsNull(req.getCarNumber()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Car is already parked!");
        }

        // 1) Find slot by ID
        Slot slot = slotRepo.findById(req.getSlotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));

        // 2) Check slot is available
        if (slot.getIsOccupied()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Selected slot is already occupied!");
        }

        // 3) Create ParkedCar
        ParkedCar car = new ParkedCar();
        car.setUser(new User(req.getUserId()));
        car.setCarNumber(req.getCarNumber());
        car.setSlot(slot);
        car.setEntryTime(LocalDateTime.now());

        // 4) Save slot as occupied and parked car
        slot.setIsOccupied(true);
        slotRepo.save(slot);
        ParkedCar saved = parkedCarRepo.save(car);

        // 5) Generate and store 4-digit one-time key
        String code = String.valueOf((int)(Math.random() * 9000) + 1000);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        SlotKey slotKey = new SlotKey();
        slotKey.setUserId(req.getUserId().longValue());
        slotKey.setSlotId(req.getSlotId().longValue());
        slotKey.setKeyCode(code);
        slotKey.setExpiresAt(expiresAt);
        slotKey.setUsed(false);
        slotKeyRepo.save(slotKey);

        // 6) Prepare and return DTO
        ActiveDto dto = new ActiveDto();
        dto.setParkedId(saved.getId());
        dto.setCarNumber(saved.getCarNumber());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setEntryTime(saved.getEntryTime());
        dto.setBuildingName(slot.getBuilding().getName());
        dto.setKey(code); // One-time key for UI

        return dto;
    }

    // UNPARK: (existing logic unchanged)
    @Override
    @Transactional
    public HistoryDto unpark(UnparkRequest req) {
        ParkedCar car = parkedCarRepo.findByCarNumberAndExitTimeIsNull(req.getCarNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active car not found: " + req.getCarNumber()));

        car.setExitTime(LocalDateTime.now());
        Duration dur = Duration.between(car.getEntryTime(), car.getExitTime());
        long hours = Math.max(1, dur.toHours());

        // Use String slotType for rate lookup
        BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                .getRatePerHour();
        BigDecimal fee = rate.multiply(BigDecimal.valueOf(hours));
        car.setFee(fee);
        parkedCarRepo.save(car);

        Slot slot = car.getSlot();
        slot.setIsOccupied(false);
        slotRepo.save(slot);

        Payment payment = new Payment();
        payment.setParkedCar(car);
        // Or get from req if needed
        payment.setAmount(fee);
        paymentRepo.save(payment);

        HistoryDto dto = new HistoryDto();
        dto.setParkedId(car.getId());
        dto.setCarNumber(car.getCarNumber());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setBuildingName(slot.getBuilding().getName());
        dto.setEntryTime(car.getEntryTime());
        dto.setExitTime(car.getExitTime());
        dto.setFee(car.getFee());
        return dto;
    }

    // ACTIVE STATUS
    @Override
    public List<ActiveDto> getActiveStatus(Integer userId) {
        return parkedCarRepo.findByUser_IdAndExitTimeIsNull(userId)

                .stream()
                .map(c -> {
                    ActiveDto d = new ActiveDto();
                    d.setParkedId(c.getId());
                    d.setCarNumber(c.getCarNumber());
                    d.setSlotNumber(c.getSlot().getSlotNumber());
                    d.setEntryTime(c.getEntryTime());
                    d.setBuildingName(c.getSlot().getBuilding().getName());
                    // d.setKey(null); // Optionally: don't expose key here
                    return d;
                }).collect(Collectors.toList());
    }

    // HISTORY
    @Override
    public List<HistoryDto> getHistory(Integer userId) {
        return parkedCarRepo.findByUser_IdAndExitTimeIsNotNull(userId)

                .stream()
                .map(c -> {
                    HistoryDto d = new HistoryDto();
                    d.setParkedId(c.getId());
                    d.setCarNumber(c.getCarNumber());
                    d.setSlotNumber(c.getSlot().getSlotNumber());
                    d.setBuildingName(c.getSlot().getBuilding().getName());
                    d.setEntryTime(c.getEntryTime());
                    d.setExitTime(c.getExitTime());
                    d.setFee(c.getFee());
                    return d;
                }).collect(Collectors.toList());
    }

    // BUILDINGS
    @Override
    public List<BuildingDto> getAllBuildings() {
        return buildingRepo.findAll().stream()
                .map(b -> new BuildingDto(b.getId(), b.getName(), b.getNumberOfFloors()))
                .collect(Collectors.toList());
    }

    // SLOTS BY BUILDING
    @Override
    public List<SlotDto> getSlotsByBuilding(Integer buildingId) {
        return slotRepo.findByBuilding_Id(buildingId)
                .stream()
                .map(s -> new SlotDto(
                        s.getId(),
                        s.getSlotNumber(),
                        s.getSlotType(),
                        s.getIsOccupied(),
                        s.getFloor()      // <-- Now includes floor!
                ))
                .collect(Collectors.toList());
    }

    // VERIFY SLOT KEY
    @Override
    public String verifySlotKey(Integer userId, Integer slotId, String inputKey) {
        Optional<SlotKey> optional = slotKeyRepo.findTopByUserIdAndSlotIdAndKeyCodeOrderByIdDesc(
                userId.longValue(), slotId.longValue(), inputKey);

        if (optional.isEmpty()) return "No key found for this slot.";

        SlotKey slotKey = optional.get();
        if (Boolean.TRUE.equals(slotKey.getUsed())) return "Key already used.";
        if (LocalDateTime.now().isAfter(slotKey.getExpiresAt())) return "Key expired.";

        slotKey.setUsed(true);
        slotKeyRepo.save(slotKey);
        return "success";
    }

    @Override
    @Transactional
    public PaymentKeyResponse checkoutAndGenerateKey(Integer parkedId) {
        ParkedCar car = parkedCarRepo.findById(parkedId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

        // Set exitTime (if not set)
        if (car.getExitTime() == null) {
            car.setExitTime(LocalDateTime.now());
        }

        // Always calculate fee
        LocalDateTime entry = car.getEntryTime();
        LocalDateTime exit = car.getExitTime();
        long hours = Math.max(1, Duration.between(entry, exit).toHours());

        // Get fixed rate from DB
        BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                .getRatePerHour();
        BigDecimal fee = rate.multiply(BigDecimal.valueOf(hours));
        car.setFee(fee);
        parkedCarRepo.save(car);

        // Save payment (simulate "paid")
        Payment payment = paymentRepo.findByParkedCar(car).orElse(new Payment());
        payment.setParkedCar(car);
        payment.setAmount(fee);
        payment.setPaymentTime(LocalDateTime.now());
        paymentRepo.save(payment);

        // **FREE THE SLOT**
        Slot slot = car.getSlot();
        slot.setIsOccupied(false);
        slotRepo.save(slot);

        // Generate one-time unlock key
        String code = String.valueOf((int)(Math.random() * 9000) + 1000);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
        SlotKey slotKey = new SlotKey();
        slotKey.setUserId(car.getUser().getId().longValue());
        slotKey.setSlotId(car.getSlot().getId().longValue());
        slotKey.setKeyCode(code);
        slotKey.setExpiresAt(expiresAt);
        slotKey.setUsed(false);
        slotKeyRepo.save(slotKey);

        return new PaymentKeyResponse(code, expiresAt, fee);
    }

    @Override
    public ActiveDto getActiveById(Integer parkedId) {
        ParkedCar car = parkedCarRepo.findById(parkedId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
        ActiveDto dto = new ActiveDto();
        dto.setParkedId(car.getId());
        dto.setCarNumber(car.getCarNumber());
        dto.setSlotNumber(car.getSlot().getSlotNumber());
        dto.setSlotId(car.getSlot().getId());
        dto.setUserId(car.getUser().getId());
        dto.setEntryTime(car.getEntryTime());
        dto.setBuildingName(car.getSlot().getBuilding().getName());
        // Calculate a "preview" fee even if not unparked yet!
        BigDecimal fee = car.getFee();
        if (fee == null) {
            LocalDateTime entry = car.getEntryTime();
            LocalDateTime exit = LocalDateTime.now(); // Use NOW as pretend-exit time
            long hours = Math.max(1, Duration.between(entry, exit).toHours());
            // Lookup rate
            BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                    .getRatePerHour();
            fee = rate.multiply(BigDecimal.valueOf(hours));
        }
        dto.setFee(fee);
        // <------ THIS!
        return dto;
    }


}
