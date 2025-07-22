package com.parking_system.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "parking_rates")
public class ParkingRate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false)
    private SlotType slotType;

    @Column(name = "rate_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerHour;

    // getters & setters ...

    public Integer getId() {
        return id;
    }

    public SlotType getSlotType() {
        return slotType;
    }

    public BigDecimal getRatePerHour() {
        return ratePerHour;
    }
}
