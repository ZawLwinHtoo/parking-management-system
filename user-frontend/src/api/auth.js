// frontend/src/api/auth.js
import axios from 'axios'

const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: { 'Content-Type': 'application/json' }
})

/**
 * Register a new user.
 * @param {{ username: string, password: string, fullName: string, email: string }} dto
 * @returns {Promise} resolves to created User object
 */
export function register(dto) {
  return authApi.post('/register', dto)
}

/**
 * Log in an existing user.
 * @param {{ username: string, password: string }} dto
 * @returns {Promise} resolves to { token: string, user: User }
 */
export function login(dto) {
  return authApi.post('/login', dto)
}
