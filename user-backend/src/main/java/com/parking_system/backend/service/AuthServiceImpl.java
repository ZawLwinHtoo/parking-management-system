package com.parking_system.backend.service;

import com.parking_system.backend.dto.UserRegistrationDto;
import com.parking_system.backend.dto.LoginResponse;
import com.parking_system.backend.model.User;
import com.parking_system.backend.model.Role;
import com.parking_system.backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(UserRegistrationDto dto) {
        User u = new User();
        u.setUsername(dto.getUsername());
        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        u.setFullName(dto.getFullName());
        u.setEmail(dto.getEmail());
        u.setRole(Role.USER);
        return userRepo.save(u);
    }

    @Override
    public LoginResponse login(UserRegistrationDto dto) {
        // Fetch user or throw 401
        User u = userRepo.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        // DEBUG LOGGING: show raw vs encoded
        log.debug("Attempting login for {}: raw='{}', encoded='{}'",
                dto.getUsername(),
                dto.getPassword(),
                u.getPassword());

        // Verify password
        if (!passwordEncoder.matches(dto.getPassword(), u.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        // Generate (fake) token
        String token = "fake-jwt-for-user-" + u.getId();
        return new LoginResponse(token, u);
    }
}
