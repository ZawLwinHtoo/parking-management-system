package com.parking_system.backend.controller;

import com.parking_system.backend.dto.LoginResponse;
import com.parking_system.backend.dto.UserRegistrationDto;
import com.parking_system.backend.model.User;
import com.parking_system.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegistrationDto dto) {
        // dto.fullName and dto.email must be non-null here
        User created = authService.register(dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UserRegistrationDto dto) {
        // dto.fullName and dto.email will be ignored in login flow
        LoginResponse resp = authService.login(dto);
        return ResponseEntity.ok(resp);
    }
}
