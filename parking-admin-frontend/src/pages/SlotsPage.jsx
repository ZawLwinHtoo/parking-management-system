// src/pages/SlotsPage.jsx
import React, { useState, useEffect } from "react";
import {
  fetchSlots,
  addSlot,
  toggleSlot,
  deleteSlot,
} from "../api/slots";

export default function SlotsPage() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");

  // Fetch slots on load
  useEffect(() => {
    getAllSlots();
  }, []);

  const getAllSlots = async () => {
    try {
      const res = await fetchSlots();
      setSlots(res.data);
    } catch (err) {
      alert("Error loading slots");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSlot.trim()) return;
    try {
      await addSlot(newSlot.trim());
      setNewSlot("");
      getAllSlots();
    } catch {
      alert("Could not add slot");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleSlot(id);
      getAllSlots();
    } catch {
      alert("Could not toggle slot");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlot(id);
      getAllSlots();
    } catch {
      alert("Could not delete slot");
    }
  };

  return (
    <div>
      <h1>Admin Parking Dashboard</h1>
      <h2>Parking Slots</h2>
      <ul>
        {slots.map((slot) => (
          <li key={slot.id}>
            {slot.slotNumber} - {slot.isAvailable ? "Available" : "Occupied"}{" "}
            <button onClick={() => handleToggle(slot.id)}>Toggle</button>{" "}
            <button onClick={() => handleDelete(slot.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={newSlot}
          placeholder="Slot number"
          onChange={(e) => setNewSlot(e.target.value)}
        />
        <button type="submit">Add Slot</button>
      </form>
    </div>
  );
}
