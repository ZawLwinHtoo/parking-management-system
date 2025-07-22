import React, { useState } from 'react'
import { parkCar } from '../api/parking'

export default function ParkForm({ userId, onSuccess }) {
  const [carNumber, setCarNumber] = useState('')
  const [slotType, setSlotType] = useState('MEDIUM')  // <-- Add this
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await parkCar({ userId, carNumber, carModel: '', slotType })  // <-- Use slotType here
      setCarNumber('')
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Park failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <label>
        Car Number:{' '}
        <input
          value={carNumber}
          onChange={e => setCarNumber(e.target.value)}
          required
        />
      </label>
      <label style={{ marginLeft: '10px' }}>
        Slot Type:
        <select value={slotType} onChange={e => setSlotType(e.target.value)}>
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
        {loading ? 'Parking...' : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
