package com.parking_system.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.parking_system.backend.model.Building;

public interface BuildingRepository extends JpaRepository<Building, Integer> {
}
