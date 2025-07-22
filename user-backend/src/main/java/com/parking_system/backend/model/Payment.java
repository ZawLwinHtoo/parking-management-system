package com.parking_system.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name = "parked_car_id", nullable = false)
    private ParkedCar parkedCar;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_time", nullable = false)
    private LocalDateTime paymentTime = LocalDateTime.now();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // getters & setters ...

    public void setId(Integer id) {
        this.id = id;
    }

    public void setParkedCar(ParkedCar parkedCar) {
        this.parkedCar = parkedCar;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
