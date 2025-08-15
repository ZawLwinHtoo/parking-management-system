package com.parking_system.backend.service;

import com.parking_system.backend.model.User;
import com.parking_system.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUser(Integer userId, String fullName, String phone, byte[] profileImage) {
        User user = getUserById(userId);
        if (fullName != null) user.setFullName(fullName);
        if (phone != null) user.setPhone(phone);
        if (profileImage != null) user.setProfileImage(profileImage);
        return userRepository.save(user);
    }

    public byte[] getProfileImage(Integer userId) {
        User user = getUserById(userId);
        return user.getProfileImage();
    }
}
