// frontend/src/api/parking.js
import axios from 'axios'

const parkingApi = axios.create({
  baseURL: 'http://localhost:8080/api/parking',
  headers: { 'Content-Type': 'application/json' }
})

parkingApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function parkCar(req) {
  return parkingApi.post('/park', req)
}

export function unparkCar(req) {
  return parkingApi.post('/unpark', req)
}

export function getBuildings() {
  return parkingApi.get('/buildings');
}

export function getSlotsByBuilding(buildingId) {
  return parkingApi.get(`/slots?buildingId=${buildingId}`);
}

// FIXED: Always use parkingApi here:
export function paymentCheckout(parkedId) {
  return parkingApi.post('/payment/checkout', { parkedId });
}

export function getActiveById(parkedId) {
  return parkingApi.get(`/active/${parkedId}`);
}

export function getActive(userId) {
  return parkingApi.get('/status', { params: { userId } })
}

export function getHistory(userId) {
  return parkingApi.get('/history', { params: { userId } })
}
