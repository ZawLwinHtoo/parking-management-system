package com.parking_system.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "slots")
@Data
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "slot_number", nullable = false)
    private String slotNumber;

    @Column(name = "is_occupied")
    private Boolean isOccupied;

    @Column(name = "slot_type")
    private String slotType;

    @Column(name = "location")
    private String location;

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;

    @Column(name = "floor")
    private Integer floor;
    @Enumerated(EnumType.STRING)
    // If you want to add more fields from your DB, add them here

    // Lombok @Data generates getters, setters, toString, equals, hashCode

    // If you do NOT use Lombok, uncomment below
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
}
