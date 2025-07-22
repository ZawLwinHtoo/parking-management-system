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
<form onSubmit={handleSubmit} className="row align-items-end g-2 mb-3">
  <div className="col-sm-4">
    <label className="form-label">Car Number</label>
    <input
      className="form-control bg-dark text-light border-secondary"
      value={carNumber}
      onChange={e => setCarNumber(e.target.value)}
      required
    />
  </div>
  <div className="col-sm-4">
    <label className="form-label">Slot Type</label>
    <select
      className="form-select bg-dark text-light border-secondary"
      value={slotType}
      onChange={e => setSlotType(e.target.value)}
    >
      <option value="SMALL">SMALL</option>
      <option value="MEDIUM">MEDIUM</option>
      <option value="LARGE">LARGE</option>
    </select>
  </div>
  <div className="col-sm-4">
    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
      {loading ? 'Parking...' : 'Submit'}
    </button>
  </div>
  {error && <div className="col-12"><div className="alert alert-danger mt-2">{error}</div></div>}
</form>

  )
}
