// frontend/src/api/parking.js
import axios from 'axios'

const parkingApi = axios.create({
  baseURL: 'http://localhost:8080/api/parking',
  headers: { 'Content-Type': 'application/json' }
})

// Include the JWT token on each request
parkingApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * Park a car.
 * @param {{ userId: number, carNumber: string, carModel: string, slotId: number }} req
 */
export function parkCar(req) {
  return parkingApi.post('/park', req)
}

/**
 * Unpark a car.
 * @param {{ carNumber: string }} req
 */
export function unparkCar(req) {
  return parkingApi.post('/unpark', req)
}
export function getBuildings() {
  return parkingApi.get('/buildings');
}

export function getSlotsByBuilding(buildingId) {
  return axios.get(`http://localhost:8080/api/slot/building/${buildingId}`);
}



/**
 * Fetch currently parked cars for user.
 * @param {number} userId
 */
export function getActive(userId) {
  return parkingApi.get('/status', { params: { userId } })
}

/**
 * Fetch parking history for user.
 * @param {number} userId
 */
export function getHistory(userId) {
  return parkingApi.get('/history', { params: { userId } })
}
