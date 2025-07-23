package com.example.parking_admin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "slots", uniqueConstraints = @UniqueConstraint(columnNames = {"building_id", "slot_number"}))
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_number")
    private String slotNumber;

    @Column(name = "is_occupied")
    private Boolean isOccupied;

    @Column(name = "slot_type")
    private String slotType;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id")
    private Building building;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "floor")
    private Integer floor;


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }

    public String getSlotType() { return slotType; }
    public void setSlotType(String slotType) { this.slotType = slotType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Building getBuilding() { return building; }
    public void setBuilding(Building building) { this.building = building; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
}
