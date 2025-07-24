import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await login({ username, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(120deg, #25263b 70%, #283148 100%)" }}>
      <div className="card shadow-lg p-4" style={{ minWidth: 370, borderRadius: 18, background: "linear-gradient(120deg, #26273a 90%, #344a7b 100%)" }}>
        <h2 className="fw-bold text-center mb-3 text-light">Login</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary w-100 fw-bold mb-2" type="submit">Login</button>
        </form>
        <div className="text-center mt-2">
          <span className="text-light">Don’t have an account? </span>
          <Link to="/register" className="fw-bold text-info text-decoration-none">Register here</Link>
        </div>
      </div>
    </div>
  )
}
