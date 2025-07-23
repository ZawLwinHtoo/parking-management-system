// src/api/building.js
import axios from 'axios'
export function getBuildings() {
  return axios.get('http://localhost:8080/api/buildings')
}
