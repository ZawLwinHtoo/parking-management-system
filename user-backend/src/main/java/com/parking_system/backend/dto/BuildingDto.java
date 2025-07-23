package com.parking_system.backend.dto;

import lombok.Data;

@Data
public class BuildingDto {
    private Integer id;
    private String name;
    private Integer numberOfFloors;
    public BuildingDto(Integer id, String name, Integer numberOfFloors) {
        this.id = id;
        this.name = name;
        this.numberOfFloors = numberOfFloors;
    }
}
