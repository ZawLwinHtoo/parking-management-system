package com.example.parking_admin.controller;

import com.example.parking_admin.dto.UserDto;
import com.example.parking_admin.dto.UserMapper;
import com.example.parking_admin.entity.User;
import com.example.parking_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Set this to ANY directory you want!
    private static final String PROFILE_IMAGES_DIR = "C:/Users/ZL_sht_H/Photo/profile_images/";

    // 1. Get all users (as DTOs)
    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    // 2. Get a single user by ID (as DTO)
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(u -> ResponseEntity.ok(UserMapper.toDto(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. Create a new user (accepts UserDto, returns UserDto)
    @PostMapping
    public UserDto createUser(@RequestBody UserDto userDto) {
        User user = new User();
        UserMapper.updateEntity(user, userDto);
        user.setRole(userDto.getRole() != null ? userDto.getRole() : "user");
        return UserMapper.toDto(userRepository.save(user));
    }

    // 4. Update an existing user (admin can edit their own profile)
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return userRepository.findById(id)
                .map(user -> {
                    UserMapper.updateEntity(user, userDto);
                    return ResponseEntity.ok(UserMapper.toDto(userRepository.save(user)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 5. Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. Upload profile image for user (returns updated UserDto with image path)
    @PostMapping("/{id}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();

        try {
            File dir = new File(PROFILE_IMAGES_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Save file with unique name
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File serverFile = new File(dir, filename);
            file.transferTo(serverFile);

            // Save URL (for the browser!) not the physical file path!
            String urlPath = "/api/users/profile-image/" + filename;
            user.setProfileImage(urlPath);
            userRepository.save(user);

            return ResponseEntity.ok(urlPath);
        } catch (Exception e) {
            // Don't save error to DB, just return error
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    // 7. Serve profile images from the selected directory
    @GetMapping("/profile-image/{filename:.+}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) throws IOException {
        Path imgPath = Paths.get(PROFILE_IMAGES_DIR).resolve(filename);
        Resource file = new UrlResource(imgPath.toUri());
        if (!file.exists()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .header("Content-Type", Files.probeContentType(imgPath))
                .body(file);
    }

}
