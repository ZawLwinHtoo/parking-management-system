package com.parking_system.backend.controller;

import com.parking_system.backend.model.User;
import com.parking_system.backend.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    public ProfileController(UserService userService) { this.userService = userService; }

    @GetMapping
    public ResponseEntity<User> getProfile(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // ⬇️ Accept multipart for file + text
    @PostMapping(
            value = "/update",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<User> updateProfile(
            @RequestParam("userId") Integer userId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "phone", required = false) String phone
    ) throws Exception {
        byte[] imageBytes = null;
        if (file != null && !file.isEmpty()) {
            imageBytes = file.getBytes();
        }
        User updated = userService.updateUser(userId, fullName, phone, imageBytes);
        return ResponseEntity.ok(updated);
    }

    // ⬇️ Stream the image back to the client so it persists after refresh
    @GetMapping(value = "/photo", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getPhoto(@RequestParam("userId") Integer userId) {
        byte[] photo = userService.getProfileImage(userId);
        if (photo == null || photo.length == 0) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(photo);
    }
}
