package com.parking_system.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        try {
            String extension=switch(String.valueOf(file.getContentType())) {
                case "image/png" -> ".png";
                case "image/jpeg" -> ".jpg";
                case "image/webp" -> ".webp";
                default -> null;
            };
            if(extension==null || file.isEmpty() || file.getSize()>5_000_000)
                return ResponseEntity.badRequest().body("Choose a PNG, JPEG or WebP image smaller than 5 MB.");
            String fileName=java.util.UUID.randomUUID()+extension;
            Path folder=Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(folder);
            file.transferTo(folder.resolve(fileName));

            // Return the file URL (change it accordingly if you use cloud storage)
            return ResponseEntity.status(HttpStatus.OK).body(new ImageUploadResponse("/uploads/" + fileName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }

    // Response model for returning the image URL
    public static class ImageUploadResponse {
        private String url;

        public ImageUploadResponse(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
