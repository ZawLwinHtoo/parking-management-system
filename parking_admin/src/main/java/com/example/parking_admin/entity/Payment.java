package com.example.parking_admin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private LocalDateTime paidAt;

    @ManyToOne
    @JoinColumn(name = "parked_car_id")
    private ParkedCar parkedCar;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public ParkedCar getParkedCar() { return parkedCar; }
    public void setParkedCar(ParkedCar parkedCar) { this.parkedCar = parkedCar; }
}
