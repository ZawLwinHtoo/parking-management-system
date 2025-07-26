package com.parking_system.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "slot_keys")
public class SlotKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long slotId;
    private String keyCode;
    private LocalDateTime expiresAt;
    private Boolean used;
    // getters & setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getSlotId() {
        return slotId;
    }

    public String getKeyCode() {
        return keyCode;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public void setKeyCode(String keyCode) {
        this.keyCode = keyCode;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }
}
