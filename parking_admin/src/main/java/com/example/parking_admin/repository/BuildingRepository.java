package com.example.parking_admin.repository;

import com.example.parking_admin.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
    boolean existsByNameIgnoreCase(String name);
}
