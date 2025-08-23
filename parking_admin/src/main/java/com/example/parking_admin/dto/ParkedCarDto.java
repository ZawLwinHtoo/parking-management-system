package com.example.parking_admin.dto;

public class ParkedCarDto {
    public Long id;
    public String carNumber;
    public String userName;
    public String slotNumber;
    public String building;
    public String entryTime;
    public String exitTime;
    public Double fee;
    public Long userId;     // <--- for edit
    public Long slotId;     // <--- for edit

    public ParkedCarDto(Long id, String carNumber, String userName, String slotNumber,
                        String building, String entryTime, String exitTime, Double fee,
                        Long userId, Long slotId) {
        this.id = id;
        this.carNumber = carNumber;
        this.userName = userName;
        this.slotNumber = slotNumber;
        this.building = building;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.fee = fee;
        this.userId = userId;
        this.slotId = slotId;
    }
    // add a default constructor if needed for JSON
    public ParkedCarDto() {}
}
