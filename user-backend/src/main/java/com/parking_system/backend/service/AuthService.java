package com.parking_system.backend.service;

import com.parking_system.backend.dto.UserRegistrationDto;
import com.parking_system.backend.dto.LoginResponse;
import com.parking_system.backend.model.User;

public interface AuthService {
    User register(UserRegistrationDto dto);
    LoginResponse login(UserRegistrationDto dto);
}
