package com.parking_system.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "parked_cars")
public class ParkedCar {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;



    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    ;

    @Column(name = "car_number", nullable = false, length = 20)
    private String carNumber;

    @Column(name = "car_model", length = 50)
    private String carModel;

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(precision = 10, scale = 2)
    private BigDecimal fee;

    @Column(length = 255)
    private String image;

    @OneToOne(mappedBy = "parkedCar", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    // getters & setters ...

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setCarNumber(String carNumber) {
        this.carNumber = carNumber;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public void setSlot(Slot slot) {
        this.slot = slot;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Integer getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getCarNumber() {
        return carNumber;
    }

    public String getCarModel() {
        return carModel;
    }

    public Slot getSlot() {
        return slot;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public BigDecimal getFee() {
        return fee;
    }

    public String getImage() {
        return image;
    }

    public Payment getPayment() {
        return payment;
    }
}
