package com.example.parking_admin.repository;

import com.example.parking_admin.entity.ParkedCar;
import com.example.parking_admin.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ParkedCarRepository extends JpaRepository<ParkedCar, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM ParkedCar p WHERE p.slot = :slot")
    void deleteBySlot(Slot slot);

}
