package com.example.parking_admin.repository;

import com.example.parking_admin.entity.ParkedCar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkedCarRepository extends JpaRepository<ParkedCar, Long> {
}
