package com.example.parking_admin.service;

import com.example.parking_admin.entity.Slot;
import com.example.parking_admin.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SlotService {
    @Autowired
    private SlotRepository slotRepository;

    public List<Slot> findAll() { return slotRepository.findAll(); }
    public Slot save(Slot slot) { return slotRepository.save(slot); }
    public void delete(Long id) { slotRepository.deleteById(id); }
}
