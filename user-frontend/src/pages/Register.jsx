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
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Username', name: 'username' },
          { label: 'Full Name', name: 'fullName' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Password', name: 'password', type: 'password' }
        ].map(field => (
          <div key={field.name}>
            <label>{field.label}: </label>
            <input
              name={field.name}
              type={field.type || 'text'}
              value={form[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}
