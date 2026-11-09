package com.example.parking_admin.controller;
import com.example.parking_admin.entity.User;
import com.example.parking_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Map;
@RestController @RequestMapping("/api")
public class AuthController {
    @Autowired private UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> credentials) {
        String name=credentials.getOrDefault("username", "");
        String password=credentials.getOrDefault("password", "");
        User user=users.findByUsername(name).orElse(null);
        if(user==null || user.getPassword()==null || !encoder.matches(password,user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error","Invalid username or password"));
        if(!"admin".equalsIgnoreCase(user.getRole()))
            return ResponseEntity.status(403).body(Map.of("error","Admin role required"));
        return ResponseEntity.ok(Map.of("id",user.getId(),"username",user.getUsername(),"role",user.getRole(),
            "fullName",user.getFullName()==null?user.getUsername():user.getFullName(),
            "profileImage",user.getProfileImage()==null?"/images/default-profile.jpg":user.getProfileImage()));
    }
}
