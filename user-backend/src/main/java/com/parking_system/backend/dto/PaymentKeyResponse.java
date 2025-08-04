// com.parking_system.backend.dto.PaymentKeyResponse.java
package com.parking_system.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentKeyResponse {
    private String code;
    private LocalDateTime expiresAt;
    private BigDecimal fee;

    public PaymentKeyResponse() {}
    public PaymentKeyResponse(String code, LocalDateTime expiresAt, BigDecimal fee) {
        this.code = code;
        this.expiresAt = expiresAt;
        this.fee = fee;
    }
    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public BigDecimal getFee() { return fee; }
    public void setFee(BigDecimal fee) { this.fee = fee; }
}
