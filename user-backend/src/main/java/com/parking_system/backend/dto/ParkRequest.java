package com.parking_system.backend.dto;

import lombok.Data;

@Data
public class ParkRequest {
    private Integer userId;
    private String carNumber;
    private String carModel;
    private String slotType;  // SMALL, MEDIUM, LARGE
    private Integer slotId;
    private String image;    // optional image URL
}