// src/api/slot.js
import axios from 'axios'
export function getSlots(buildingId) {
  return axios.get('http://localhost:8080/api/slots/by-building', { params: { buildingId } })
}
