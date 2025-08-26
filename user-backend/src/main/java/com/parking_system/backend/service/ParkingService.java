package com.parking_system.backend.service;

import com.parking_system.backend.dto.*;
import java.util.List;

public interface ParkingService {
    ActiveDto park(ParkRequest req);
    HistoryDto unpark(UnparkRequest req);
    List<ActiveDto> getActiveStatus(Integer userId);
    List<HistoryDto> getHistory(Integer userId);
    List<BuildingDto> getAllBuildings();
    List<SlotDto> getSlotsByBuilding(Integer buildingId);
    String verifySlotKey(Integer userId, Integer slotId, String inputKey);
    PaymentKeyResponse checkoutAndGenerateKey(Integer parkedId);
    ActiveDto getActiveById(Integer parkedId);
    void cancelPendingPark(Integer parkedId, Integer userId);// << Add this!
}
