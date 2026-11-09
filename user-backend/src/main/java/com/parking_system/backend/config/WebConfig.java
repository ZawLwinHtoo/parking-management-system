package com.parking_system.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

/**
 * Allow CORS globally for your React app.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @org.springframework.beans.factory.annotation.Value("${upload.dir:./uploads}")
    private String uploadDir;
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    @Override
    public void addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations(java.nio.file.Paths.get(uploadDir).toAbsolutePath().toUri().toString()+"/");
    }
}
