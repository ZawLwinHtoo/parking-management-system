package com.parking_system.backend.repository;

import com.parking_system.backend.model.ParkingRate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ParkingRateRepository extends JpaRepository<ParkingRate, Integer> {
    Optional<ParkingRate> findBySlotType(String slotType);

}
