package com.parking_system.backend.repository;

import com.parking_system.backend.model.ParkedCar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ParkedCarRepository extends JpaRepository<ParkedCar, Integer> {
    List<ParkedCar> findByUser_IdAndExitTimeIsNull(Integer userId);
    List<ParkedCar> findByUser_IdAndExitTimeIsNotNull(Integer userId);
    Optional<ParkedCar> findByCarNumberAndExitTimeIsNull(String carNumber);
}
