package com.parking_system.backend.service;

import com.parking_system.backend.dto.*;

import java.util.List;

public interface ParkingService {
    ActiveDto park(ParkRequest request);

    HistoryDto unpark(UnparkRequest request);

    List<ActiveDto> getActiveStatus(Integer userId);

    List<HistoryDto> getHistory(Integer userId);

    List<SlotDto> getSlotsByBuilding(Integer buildingId);

    List<BuildingDto> getAllBuildings();

    String verifySlotKey(Integer userId, Integer slotId, String key);
}

