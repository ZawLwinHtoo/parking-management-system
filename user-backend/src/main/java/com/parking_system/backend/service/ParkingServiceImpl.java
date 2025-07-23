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
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class ParkingServiceImpl implements ParkingService {

    @Autowired private SlotRepository slotRepo;
    @Autowired private ParkedCarRepository parkedCarRepo;
    @Autowired private ParkingRateRepository rateRepo;
    @Autowired private PaymentRepository paymentRepo;
    @Autowired
    private BuildingRepository buildingRepo;
    // PARK
    @Override
    @Transactional
    public ActiveDto park(ParkRequest req) {
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
        // carModel optional, leave blank or set if you add it to req
        // car.setCarModel(req.getCarModel());

        // 4) Save slot as occupied and parked car
        slot.setIsOccupied(true);
        slotRepo.save(slot);
        ParkedCar saved = parkedCarRepo.save(car);

        // 5) Prepare and return DTO
        ActiveDto dto = new ActiveDto();
        dto.setParkedId(saved.getId());
        dto.setCarNumber(saved.getCarNumber());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setEntryTime(saved.getEntryTime());
        dto.setBuildingName(slot.getBuilding().getName());
        return dto;
    }

    // UNPARK
    @Override
    @Transactional
    public HistoryDto unpark(UnparkRequest req) {
        // 1) Find active parked car by car number
        ParkedCar car = parkedCarRepo.findByCarNumberAndExitTimeIsNull(req.getCarNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active car not found: " + req.getCarNumber()));

        // 2) Set exit time
        car.setExitTime(LocalDateTime.now());
        Duration dur = Duration.between(car.getEntryTime(), car.getExitTime());
        long hours = Math.max(1, dur.toHours());

        // 3) Calculate fee
        BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Parking rate not defined for slot type"))
                .getRatePerHour();
        BigDecimal fee = rate.multiply(BigDecimal.valueOf(hours));
        car.setFee(fee);
        parkedCarRepo.save(car);

        // 4) Free slot
        Slot slot = car.getSlot();
        slot.setIsOccupied(false);
        slotRepo.save(slot);

        // 5) Save payment
        Payment payment = new Payment();
        payment.setParkedCar(car);
        payment.setPaymentMethod(PaymentMethod.CASH); // or get from req if needed
        payment.setAmount(fee);
        paymentRepo.save(payment);

        // 6) Return DTO
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

    // GET ACTIVE STATUS
    @Override
    public List<ActiveDto> getActiveStatus(Integer userId) {
        return parkedCarRepo.findByUserIdAndExitTimeIsNull(userId)
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

    // GET HISTORY
    @Override
    public List<HistoryDto> getHistory(Integer userId) {
        return parkedCarRepo.findByUserIdAndExitTimeIsNotNull(userId)
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
        return slotRepo.findByBuilding_Id(buildingId)   // <--- UNDERSCORE!
                .stream()
                .map(s -> new SlotDto(
                        s.getId(),
                        s.getSlotNumber(),
                        s.getSlotType().name(),
                        s.getIsOccupied()))
                .collect(Collectors.toList());
    }

}
