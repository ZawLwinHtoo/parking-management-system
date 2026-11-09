package com.example.parking_admin.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name="parking_rates")
public class ParkingRate {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="slot_type", nullable=false) private String slotType;
    @Column(name="rate_per_hour", nullable=false, precision=10, scale=2) private BigDecimal ratePerHour;
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getSlotType(){return slotType;}
    public void setSlotType(String type){slotType=type;}
    public BigDecimal getRatePerHour(){return ratePerHour;}
    public void setRatePerHour(BigDecimal rate){ratePerHour=rate;}
}
