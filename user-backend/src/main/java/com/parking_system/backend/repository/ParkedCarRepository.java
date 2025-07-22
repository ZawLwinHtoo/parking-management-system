package com.parking_system.backend.repository;

import com.parking_system.backend.model.ParkedCar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ParkedCarRepository extends JpaRepository<ParkedCar, Integer> {
    // Active (not yet exited) cars for a user
    List<ParkedCar> findByUserIdAndExitTimeIsNull(Integer userId);
    // Historical (exited) cars for a user
    List<ParkedCar> findByUserIdAndExitTimeIsNotNull(Integer userId);
    // Find by car number (optionally to unpark)
    Optional<ParkedCar> findByCarNumberAndExitTimeIsNull(String carNumber);
}
