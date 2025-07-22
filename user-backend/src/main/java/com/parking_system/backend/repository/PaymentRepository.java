package com.parking_system.backend.repository;

import com.parking_system.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByParkedCarId(Integer parkedCarId);
}
