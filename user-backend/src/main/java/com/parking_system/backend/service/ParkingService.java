package com.parking_system.backend.service;

import com.parking_system.backend.dto.ParkRequest;
import com.parking_system.backend.dto.UnparkRequest;
import com.parking_system.backend.dto.ActiveDto;
import com.parking_system.backend.dto.HistoryDto;
import java.util.List;

public interface ParkingService {
    ActiveDto park(ParkRequest request);
    HistoryDto unpark(UnparkRequest request);
    List<ActiveDto> getActiveStatus(Integer userId);
    List<HistoryDto> getHistory(Integer userId);
}
