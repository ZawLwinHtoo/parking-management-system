package com.parking_system.backend.service;

import com.parking_system.backend.dto.*;
import com.parking_system.backend.model.*;
import com.parking_system.backend.repository.*;

import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.RoundingMode;
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

    // Accept AA-1234 and 1A-1234
    private static final Pattern PLATE_RE =
            Pattern.compile("^[A-Z]{2}-\\d{4}$|^[1-9][A-Z]-\\d{4}$");

    @Override
    @Transactional
    public ActiveDto park(ParkRequest req) {
        String raw = Optional.ofNullable(req.getCarNumber()).orElse("").trim().toUpperCase();
        if (!PLATE_RE.matcher(raw).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid car number format. Use formats like 1A-1234 or AA-1234"
            );
        }

        // Prevent double parking (return precise message)
        if (parkedCarRepo.findByCarNumberAndExitTimeIsNull(req.getCarNumber()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Duplicated Car Number");
        }

        // 1) Find slot by ID
        Slot slot = slotRepo.findById(req.getSlotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));

        // 2) Check slot is available (return precise message)
        if (Boolean.TRUE.equals(slot.getIsOccupied())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Selected slot is already occupied!");
        }

        // 3) Create ParkedCar
        ParkedCar car = new ParkedCar();
        car.setUser(new User(req.getUserId()));
        car.setCarNumber(raw); // store normalized uppercase
        car.setSlot(slot);
        car.setEntryTime(LocalDateTime.now());

        // 4) Save slot as occupied and parked car
        slot.setIsOccupied(true);
        slotRepo.save(slot);
        ParkedCar saved = parkedCarRepo.save(car);

        // 5) Generate and store 4-digit one-time key (5 min)
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

    @Override
    @Transactional
    public HistoryDto unpark(UnparkRequest req) {
        ParkedCar car = parkedCarRepo.findByCarNumberAndExitTimeIsNull(
                Optional.ofNullable(req.getCarNumber()).orElse("").toUpperCase()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Active car not found: " + req.getCarNumber()
        ));

        car.setExitTime(LocalDateTime.now());

        // Get rate per hour from DB
        BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                .getRatePerHour();

        // Per-minute with 60-minute grace
        BigDecimal fee = computeFee(car.getEntryTime(), car.getExitTime(), rate);

        car.setFee(fee);
        parkedCarRepo.save(car);

        Slot slot = car.getSlot();
        slot.setIsOccupied(false);
        slotRepo.save(slot);

        Payment payment = new Payment();
        payment.setParkedCar(car);
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
                    return d;
                }).collect(Collectors.toList());
    }

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

    @Override
    public List<BuildingDto> getAllBuildings() {
        return buildingRepo.findAll().stream()
                .map(b -> new BuildingDto(b.getId(), b.getName(), b.getNumberOfFloors()))
                .collect(Collectors.toList());
    }

    @Override
    public List<SlotDto> getSlotsByBuilding(Integer buildingId) {
        return slotRepo.findByBuilding_Id(buildingId)
                .stream()
                .map(s -> new SlotDto(
                        s.getId(),
                        s.getSlotNumber(),
                        s.getSlotType(),
                        s.getIsOccupied(),
                        s.getFloor()
                ))
                .collect(Collectors.toList());
    }

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

        if (car.getExitTime() == null) {
            car.setExitTime(LocalDateTime.now());
        }

        BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                .getRatePerHour();

        BigDecimal fee = computeFee(car.getEntryTime(), car.getExitTime(), rate);

        car.setFee(fee);
        parkedCarRepo.save(car);

        Payment payment = paymentRepo.findByParkedCar(car).orElse(new Payment());
        payment.setParkedCar(car);
        payment.setAmount(fee);
        payment.setPaymentTime(LocalDateTime.now());
        paymentRepo.save(payment);

        // Free the slot
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

        BigDecimal fee = car.getFee();
        if (fee == null) {
            BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                    .getRatePerHour();
            fee = computeFee(car.getEntryTime(), LocalDateTime.now(), rate); // live estimate
        }
        dto.setFee(fee);
        return dto;
    }


    private BigDecimal computeFee(LocalDateTime entry, LocalDateTime exit, BigDecimal hourlyRate) {
        if (entry == null || exit == null || hourlyRate == null) return BigDecimal.ZERO;

        // ceil to the next full minute so 30m01s counts as 31 minutes
        long seconds = Duration.between(entry, exit).getSeconds();
        if (seconds <= 0) return BigDecimal.ZERO;
        long minutes = (seconds + 59) / 60; // ceiling division to minutes

        // 0–30 min: free
        if (minutes <= 30) return BigDecimal.ZERO;

        // pro-rate: hourlyRate * minutes / 60, round UP
        BigDecimal fee = hourlyRate
                .multiply(BigDecimal.valueOf(minutes))
                .divide(BigDecimal.valueOf(60), 0, RoundingMode.CEILING);

        // minimum charge after 30 minutes is 1,500 MMK
        return fee.max(new BigDecimal("1500"));
    }


    // Cancel pending parking when key verification never happened / user closed modal.
    @Override
    @Transactional
    public void cancelPendingPark(Integer parkedId, Integer userId) {
        ParkedCar car = parkedCarRepo.findById(parkedId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pending parking not found."));

        // (Optional) ownership check
        if (userId != null && car.getUser() != null && car.getUser().getId() != null
                && !Objects.equals(car.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot cancel this parking session.");
        }

        if (car.getExitTime() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This parking session has already been finalized.");
        }

        // Free the slot
        Slot slot = car.getSlot();
        if (slot != null) {
            slot.setIsOccupied(false);
            slotRepo.save(slot);
        }

        // Invalidate the latest key for this user/slot (so it can't be used later)
        if (car.getUser() != null && slot != null) {
            slotKeyRepo.findTopByUserIdAndSlotIdOrderByIdDesc(
                    car.getUser().getId().longValue(), slot.getId().longValue()
            ).ifPresent(k -> {
                if (Boolean.FALSE.equals(k.getUsed())) {
                    k.setUsed(true);
                    slotKeyRepo.save(k);
                }
            });
        }

        // Remove the parked car record (verification never succeeded)
        parkedCarRepo.delete(car);
    }
}
