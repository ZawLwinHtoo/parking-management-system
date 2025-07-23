package com.parking_system.backend;

import com.parking_system.backend.repository.BuildingRepository;
import com.parking_system.backend.repository.SlotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.parking_system.backend.model.*;

@Component
public class DemoDataLoader implements CommandLineRunner {
    @Autowired
    SlotRepository slotRepo;
    @Autowired
    BuildingRepository buildingRepo;

    @Override
    public void run(String... args) throws Exception {
        Building b1 = buildingRepo.findById(1).orElse(null);
        if (b1 != null && slotRepo.findByBuilding_Id(1).isEmpty()) {
            slotRepo.save(new Slot(null, "S1", false, SlotType.SMALL, b1));
            slotRepo.save(new Slot(null, "M1", false, SlotType.MEDIUM, b1));
            slotRepo.save(new Slot(null, "L1", false, SlotType.LARGE, b1));
        }
    }
}
