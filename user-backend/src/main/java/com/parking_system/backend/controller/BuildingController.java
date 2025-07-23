package com.parking_system.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.parking_system.backend.repository.BuildingRepository;
import com.parking_system.backend.model.Building;
import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@CrossOrigin(origins = "http://localhost:5173")
public class BuildingController {
    @Autowired private BuildingRepository buildingRepo;

    @GetMapping
    public List<Building> all() {
        return buildingRepo.findAll();
    }
}
