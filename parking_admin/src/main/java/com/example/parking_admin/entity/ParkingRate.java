package com.example.parking_admin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_rates")
public class ParkingRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double hourlyRate;
    private Double dailyMax;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public Double getDailyMax() { return dailyMax; }
    public void setDailyMax(Double dailyMax) { this.dailyMax = dailyMax; }
}
