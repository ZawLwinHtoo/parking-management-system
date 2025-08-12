package com.parking_system.backend.controller;

import com.parking_system.backend.model.User;
import com.parking_system.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    // Method to get the user profile using the userId (no JWT)
    @GetMapping
    public ResponseEntity<User> getProfile(@RequestParam("userId") Integer userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // Method to update the user profile using the userId (no JWT)
    @PostMapping("/update")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser, @RequestParam("userId") Integer userId) {
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }
}
