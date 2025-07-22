// src/api/slots.js
import axios from "axios";

// You can set the base URL here if you want
const api = axios.create({
  baseURL: "/api"
});

export const fetchSlots = () => api.get("/slots");

export const addSlot = (slotNumber) =>
  api.post("/slots", { slotNumber });

export const toggleSlot = (id) =>
  api.put(`/slots/${id}`);

export const deleteSlot = (id) =>
  api.delete(`/slots/${id}`);
