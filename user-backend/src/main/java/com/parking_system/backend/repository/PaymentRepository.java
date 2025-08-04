package com.parking_system.backend.repository;

import com.parking_system.backend.model.ParkedCar;
import com.parking_system.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByParkedCarId(Integer parkedCarId);
    Optional<Payment> findByParkedCar(ParkedCar car);
}
