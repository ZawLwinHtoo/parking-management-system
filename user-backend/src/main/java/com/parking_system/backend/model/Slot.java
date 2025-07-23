package com.parking_system.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Slot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String slotNumber; // e.g. S1, M1, L1
    private Boolean isOccupied;

    @Enumerated(EnumType.STRING)
    private SlotType slotType; // still needed for fee logic

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;

}
