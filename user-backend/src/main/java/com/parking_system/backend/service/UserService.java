package com.parking_system.backend.service;

import com.parking_system.backend.model.User;
import com.parking_system.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Method to get user by ID
    public User getUserById(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Method to update the user profile
    public User updateUser(Integer userId, User updatedUser) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update user fields, but don't allow changing email or role
        user.setFullName(updatedUser.getFullName());
        user.setPhone(updatedUser.getPhone());
        user.setProfileImage(updatedUser.getProfileImage());  // If profile image is updated
        return userRepository.save(user);
    }
}
