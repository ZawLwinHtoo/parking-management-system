package com.parking_system.backend.service;

import com.parking_system.backend.dto.ParkRequest;
import com.parking_system.backend.dto.UnparkRequest;
import com.parking_system.backend.dto.ActiveDto;
import com.parking_system.backend.dto.HistoryDto;
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
    @Autowired private PaymentRepository paymentRepo;  // ← inject this

    @Override
    @Transactional
    public ActiveDto park(ParkRequest req) {
        SlotType type = SlotType.valueOf(req.getSlotType());

        Slot slot = slotRepo.findFirstByIsOccupiedFalseAndSlotType(type)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No free slots of type " + type
                ));

        slot.setIsOccupied(true);
        slotRepo.save(slot);

        ParkedCar car = new ParkedCar();
        car.setUser(new User(req.getUserId()));
        car.setCarNumber(req.getCarNumber());
        car.setCarModel(req.getCarModel());
        car.setSlot(slot);
        car.setEntryTime(LocalDateTime.now());
        car.setImage(req.getImage());
        ParkedCar saved = parkedCarRepo.save(car);

        ActiveDto dto = new ActiveDto();
        dto.setParkedId(saved.getId());
        dto.setCarNumber(saved.getCarNumber());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setEntryTime(saved.getEntryTime());
        return dto;
    }

    @Override
    @Transactional
    public HistoryDto unpark(UnparkRequest req) {
        // 1) Find the active parked car, or 404
        ParkedCar car = parkedCarRepo.findByCarNumberAndExitTimeIsNull(req.getCarNumber())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Active car not found: " + req.getCarNumber()
                ));

        // 2) Compute fee
        car.setExitTime(LocalDateTime.now());
        Duration dur = Duration.between(car.getEntryTime(), car.getExitTime());
        long hours = Math.max(1, dur.toHours());

        BigDecimal rate = rateRepo.findBySlotType(car.getSlot().getSlotType())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Parking rate not defined for slot type"
                ))
                .getRatePerHour();

        BigDecimal fee = rate.multiply(BigDecimal.valueOf(hours));
        car.setFee(fee);
        parkedCarRepo.save(car);

        // 3) Free up the slot
        Slot slot = car.getSlot();
        slot.setIsOccupied(false);
        slotRepo.save(slot);

        // 4) Persist the payment record
        Payment payment = new Payment();
        payment.setParkedCar(car);
        payment.setPaymentMethod(PaymentMethod.CASH);
        payment.setAmount(fee);
        // paymentTime is auto‐set
        paymentRepo.save(payment);

        // 5) Build and return the DTO
        HistoryDto dto = new HistoryDto();
        dto.setParkedId(car.getId());
        dto.setCarNumber(car.getCarNumber());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setEntryTime(car.getEntryTime());
        dto.setExitTime(car.getExitTime());
        dto.setFee(car.getFee());
        return dto;
    }

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
                    return d;
                }).collect(Collectors.toList());
    }

    @Override
    public List<HistoryDto> getHistory(Integer userId) {
        return parkedCarRepo.findByUserIdAndExitTimeIsNotNull(userId)
                .stream()
                .map(c -> {
                    HistoryDto d = new HistoryDto();
                    d.setParkedId(c.getId());
                    d.setCarNumber(c.getCarNumber());
                    d.setSlotNumber(c.getSlot().getSlotNumber());
                    d.setEntryTime(c.getEntryTime());
                    d.setExitTime(c.getExitTime());
                    d.setFee(c.getFee());
                    return d;
                }).collect(Collectors.toList());
    }
}
