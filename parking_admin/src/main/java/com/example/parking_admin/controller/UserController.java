package com.example.parking_admin.controller;

import com.example.parking_admin.dto.UserDto;
import com.example.parking_admin.dto.UserMapper;
import com.example.parking_admin.entity.User;
import com.example.parking_admin.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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
@Validated
public class UserController {
    @Autowired
    private UserRepository userRepository;

    private static final String PROFILE_IMAGES_DIR = "C:/Users/ZL_sht_H/Photo/profile_images/";

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(u -> ResponseEntity.ok(UserMapper.toDto(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserDto createUser(@Valid @RequestBody UserDto userDto) {
        User user = new User();
        UserMapper.updateEntity(user, userDto);

        // If a password was provided, save it (plain here to keep logic unchanged).
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            user.setPassword(userDto.getPassword());
        }

        user.setRole(userDto.getRole() != null ? userDto.getRole() : "user");
        return UserMapper.toDto(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        return userRepository.findById(id)
                .map(user -> {
                    UserMapper.updateEntity(user, userDto);
                    return ResponseEntity.ok(UserMapper.toDto(userRepository.save(user)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();

        try {
            File dir = new File(PROFILE_IMAGES_DIR);
            if (!dir.exists()) dir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File serverFile = new File(dir, filename);
            file.transferTo(serverFile);

            String urlPath = "/api/users/profile-image/" + filename;
            user.setProfileImage(urlPath);
            userRepository.save(user);

            return ResponseEntity.ok(urlPath);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

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
