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

    @org.springframework.beans.factory.annotation.Value("${upload.dir:./uploads}")
    private String profileImagesDir;
    private final org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

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

        // Use the same BCrypt format as the login service.
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        user.setRole(userDto.getRole() != null ? userDto.getRole() : "user");
        return UserMapper.toDto(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        return userRepository.findById(id)
                .map(user -> {
                    UserMapper.updateEntity(user, userDto);
                    if(userDto.getPassword()!=null && !userDto.getPassword().isBlank()) user.setPassword(passwordEncoder.encode(userDto.getPassword()));
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
            String extension = switch(String.valueOf(file.getContentType())) {
                case "image/png" -> ".png";
                case "image/jpeg" -> ".jpg";
                case "image/webp" -> ".webp";
                default -> null;
            };
            if(extension==null || file.isEmpty() || file.getSize()>5_000_000)
                return ResponseEntity.badRequest().body("Choose a PNG, JPEG or WebP image smaller than 5 MB.");
            Path dir=Paths.get(profileImagesDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            String filename=java.util.UUID.randomUUID()+extension;
            file.transferTo(dir.resolve(filename));

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
        Path dir=Paths.get(profileImagesDir).toAbsolutePath().normalize();
        Path imgPath=dir.resolve(filename).normalize();
        if(!imgPath.startsWith(dir)) return ResponseEntity.notFound().build();
        Resource file = new UrlResource(imgPath.toUri());
        if (!file.exists()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .header("Content-Type", filename.endsWith(".png")?"image/png":filename.endsWith(".webp")?"image/webp":"image/jpeg")
                .body(file);
    }
}
