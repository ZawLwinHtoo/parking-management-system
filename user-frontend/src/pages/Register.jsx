import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await register(form)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(120deg, #25263b 70%, #283148 100%)" }}>
      <div className="card shadow-lg p-4" style={{ minWidth: 410, borderRadius: 18, background: "linear-gradient(120deg, #26273a 90%, #344a7b 100%)" }}>
        <h2 className="fw-bold text-center mb-3 text-light">Register</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Username</label>
            <input
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-light">Full Name</label>
            <input
              name="fullName"
              className="form-control"
              value={form.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <button className="btn btn-success w-100 fw-bold mb-2" type="submit">Register</button>
        </form>
        <div className="text-center mt-2">
          <span className="text-light">Already have an account? </span>
          <Link to="/login" className="fw-bold text-info text-decoration-none">Login here</Link>
        </div>
      </div>
    </div>
  )
}
