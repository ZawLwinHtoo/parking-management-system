// KeyVerifyRequest.java
package com.parking_system.backend.dto;

import lombok.Data;

@Data
public class KeyVerifyRequest {
    private Integer userId;
    private Integer slotId;
    private String key;
}
