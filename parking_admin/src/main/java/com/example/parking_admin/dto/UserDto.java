package com.example.parking_admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String fullName;

    @Email(message = "Invalid email format")
    @Pattern(
        // allow gmail.com, yahoo.com, hotmail.com (case-insensitive)
        regexp = "(?i)^[^@\\s]+@(?:gmail\\.com|yahoo\\.com|hotmail\\.com)$",
        message = "Email must be gmail.com, yahoo.com, or hotmail.com"
    )
    private String email;

    // Password is needed when creating a user (kept optional for updates)
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    @Pattern(
        regexp = "^\\+?[1-9]\\d{7,14}$",
        message = "Phone must be 8–15 digits (optional leading +)"
    )
    private String phone;

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    private String role;
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    private String profileImage;
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
