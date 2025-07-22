package com.example.parking_admin.repository;

import com.example.parking_admin.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    long countByBuildingId(Long buildingId);
    boolean existsBySlotNumberAndBuildingId(String slotNumber, Long buildingId);

}
