// src/main/java/com/parking_system/backend/exception/ApiErrorAdvice.java
package com.parking_system.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiErrorAdvice {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handle(ResponseStatusException ex) {
        HttpStatusCode status = ex.getStatusCode();
        String reason = ex.getReason();

        // Fallback phrase for when 'reason' is null/blank
        String fallback;
        if (status instanceof HttpStatus) {
            // ok to use; method is on HttpStatus (deprecated but available)
            fallback = ((HttpStatus) status).getReasonPhrase();
        } else {
            // e.g. "409 CONFLICT" -> "CONFLICT"
            String s = status.toString();
            int sp = s.indexOf(' ');
            fallback = sp > 0 ? s.substring(sp + 1).replace('_', ' ') : s;
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", (reason != null && !reason.isBlank()) ? reason : fallback);
        body.put("code", mapReasonToCode(reason));

        return ResponseEntity.status(status).body(body);
    }

    private String mapReasonToCode(String reason) {
        if (reason == null) return "GENERIC";
        String r = reason.toLowerCase();
        if (r.contains("duplicated car")) return "CAR_DUPLICATE";
        if (r.contains("occupied")) return "SLOT_OCCUPIED";
        if (r.contains("invalid car number")) return "PLATE_INVALID";
        return "GENERIC";
    }
}
