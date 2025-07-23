import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function SlotSelector({ onSelect }) {
  const [slots, setSlots] = useState([])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8080/api/slots/available')
      .then(res => setSlots(res.data))
      .catch(() => setSlots([]))
  }, [])

  function handleChange(e) {
    const slotId = e.target.value
    setSelected(slotId)
    const slot = slots.find(s => String(s.id) === String(slotId))
    onSelect(slot || null)
  }

  return (
    <div className="mb-3">
      <select
        className="form-select"
        value={selected}
        onChange={handleChange}
      >
        <option value="">-- Select a Slot --</option>
        {slots.map(slot => (
          <option key={slot.id} value={slot.id}>
            {slot.slotNumber} ({slot.slotType}, {slot.location})
          </option>
        ))}
      </select>
    </div>
  )
}
