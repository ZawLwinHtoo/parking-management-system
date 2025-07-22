package com.parking_system.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "slots")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "slot_number", nullable = false, unique = true, length = 10)
    private String slotNumber;

    @Column(name = "is_occupied", nullable = false)
    private Boolean isOccupied = false;

    /**
     * Tell JPA to use our converter for lowercase DB values.
     */
    @Convert(converter = SlotTypeConverter.class)
    @Column(name = "slot_type", nullable = false)
    private SlotType slotType;

    @Column(length = 50)
    private String location;

    public Slot() {}

    public Slot(Integer id, String slotNumber, Boolean isOccupied, SlotType slotType, String location) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.isOccupied = isOccupied;
        this.slotType = slotType;
        this.location = location;
    }

    // getters & setters

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }

    public SlotType getSlotType() { return slotType; }
    public void setSlotType(SlotType slotType) { this.slotType = slotType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
