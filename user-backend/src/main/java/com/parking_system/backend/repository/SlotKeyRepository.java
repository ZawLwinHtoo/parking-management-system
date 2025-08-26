package com.parking_system.backend.repository;

import com.parking_system.backend.model.SlotKey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SlotKeyRepository extends JpaRepository<SlotKey, Long> {
    Optional<SlotKey> findTopByUserIdAndSlotIdOrderByIdDesc(Long userId, Long slotId);
    Optional<SlotKey> findTopByUserIdAndSlotIdAndKeyCodeOrderByIdDesc(Long userId, Long slotId, String keyCode);
}
