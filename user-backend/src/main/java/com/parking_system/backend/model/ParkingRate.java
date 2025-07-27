package com.parking_system.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "parking_rates")
public class ParkingRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // --- REMOVE @Enumerated ---
    @Column(name = "slot_type", nullable = false)
    private String slotType;   // <--- CHANGE TO String

    @Column(name = "rate_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerHour;

    // getters & setters

    public Integer getId() {
        return id;
    }

    public String getSlotType() {   // <--- Change return type
        return slotType;
    }

    public void setSlotType(String slotType) {   // <--- Add setter
        this.slotType = slotType;
    }

    public BigDecimal getRatePerHour() {
        return ratePerHour;
    }

    public void setRatePerHour(BigDecimal ratePerHour) {
        this.ratePerHour = ratePerHour;
    }
}
