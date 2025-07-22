package com.example.parking_admin;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.repository.SlotRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ParkingAdminApplication {
	public static void main(String[] args) {
		SpringApplication.run(ParkingAdminApplication.class, args);
	}

//	@Bean
//	CommandLineRunner run(SlotRepository slotRepository) {
//		return args -> {
//			if (slotRepository.count() == 0) {
//				slotRepository.save(new Slot(null, "A1", true));
//				slotRepository.save(new Slot(null, "A2", false));
//				slotRepository.save(new Slot(null, "A3", true));
//			}
//		};
//	}
}


