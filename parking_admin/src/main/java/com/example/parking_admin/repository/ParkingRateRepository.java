package com.example.parking_admin.repository;

import com.example.parking_admin.entity.ParkingRate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRateRepository extends JpaRepository<ParkingRate, Long> {
}
