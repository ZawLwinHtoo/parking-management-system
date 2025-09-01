package com.example.parking_admin.controller;

import com.example.parking_admin.entity.User;
import com.example.parking_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = Logger.getLogger(AuthController.class.getName());

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Log the received credentials for debugging
        logger.info("Received login request for username: " + username);

        // Predefined user data
        String predefinedUsername = "admin";
        String predefinedPassword = "admin123";
        String predefinedRole = "admin";
        String predefinedFullName = "Admin User";
        String predefinedProfileImage = "/images/admin_profile.jpg"; // Predefined profile image URL

        // Check if the credentials match the predefined values
        if (predefinedUsername.equals(username) && predefinedPassword.equals(password)) {
            return ResponseEntity.ok(Map.of(
                    "id", 1, // Predefined ID
                    "username", predefinedUsername,
                    "role", predefinedRole,
                    "fullName", predefinedFullName,
                    "profileImage", predefinedProfileImage
            ));
        }

        try {
            // If not predefined credentials, check the database
            Optional<User> optionalUser = userRepository.findByUsername(username);

            // Log whether user is found or not
            if (optionalUser.isEmpty()) {
                logger.warning("User not found in database: " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }

            User user = optionalUser.get();
            logger.info("User found in database: " + user.getUsername());

            // Directly compare the passwords (plain text comparison)
            if (!password.equals(user.getPassword())) {
                logger.warning("Invalid password for username: " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }

            // Check if the user has an 'admin' role
            if (!"admin".equalsIgnoreCase(user.getRole())) {
                logger.warning("User is not an admin: " + username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied: Not an admin user"));
            }

            // Handle null profile image and provide a default one if necessary
            String profileImage = (user.getProfileImage() != null) ? user.getProfileImage() : "/images/default-profile.jpg";

            // Return the user data from the database if valid
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "fullName", user.getFullName(),
                    "profileImage", profileImage
            ));

        } catch (Exception e) {
            // Log the exception for debugging
            logger.log(Level.SEVERE, "Error during login process", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during login. Please try again later."));
        }
    }
}
