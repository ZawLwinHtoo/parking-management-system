// src/api/building.js
import axios from 'axios'
export function getBuildings() {
  return axios.get('/api/buildings')
}
