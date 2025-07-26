package com.parking_system.backend.service;

import com.parking_system.backend.model.SlotKey;
import com.parking_system.backend.repository.SlotKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SlotKeyService {

    @Autowired
    private SlotKeyRepository slotKeyRepository;

    public SlotKey generateKey(Long userId, Long slotId) {
        String key = String.valueOf((int)(Math.random() * 9000) + 1000);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        SlotKey slotKey = new SlotKey();
        slotKey.setUserId(userId);
        slotKey.setSlotId(slotId);
        slotKey.setKeyCode(key);
        slotKey.setExpiresAt(expiresAt);
        slotKey.setUsed(false);

        return slotKeyRepository.save(slotKey);
    }

    public String verifyKey(Long userId, Long slotId, String inputKey) {
        Optional<SlotKey> optional = slotKeyRepository.findTopByUserIdAndSlotIdAndKeyCodeOrderByIdDesc(userId, slotId, inputKey);

        if (optional.isEmpty()) return "No key found for this slot.";

        SlotKey slotKey = optional.get();
        if (slotKey.getUsed()) return "Key already used.";
        if (LocalDateTime.now().isAfter(slotKey.getExpiresAt())) return "Key expired.";

        // Mark as used
        slotKey.setUsed(true);
        slotKeyRepository.save(slotKey);

        return "success";
    }
}
