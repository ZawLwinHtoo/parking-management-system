package com.parking_system.backend.repository;

import com.parking_system.backend.model.Slot;
import com.parking_system.backend.model.SlotType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Integer> {
    Optional<Slot> findFirstByIsOccupiedFalseAndSlotType(SlotType slotType);
    List<Slot> findByIsOccupiedFalse();
    List<Slot> findByIsOccupiedTrue();
    // Use this for JPA

    List<Slot> findByBuilding_Id(Integer buildingId);

}
