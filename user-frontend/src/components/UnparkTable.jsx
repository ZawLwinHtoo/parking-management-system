import React from 'react'
import { unparkCar } from '../api/parking'

export default function UnparkTable({ activeList, onUnpark }) {
  const handleUnpark = async carNumber => {
    try {
      await unparkCar({ carNumber })
      onUnpark()
    } catch (err) {
      console.error(err)
    }
  }

  if (!activeList.length) {
    return <p>No cars currently parked.</p>
  }

  return (
    <table border="1" cellSpacing="0" cellPadding="8" style={{ marginBottom: '20px' }}>
      <thead>
        <tr>
          <th>Car Number</th>
          <th>Slot</th>
          <th>Entry Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {activeList.map(item => (
          <tr key={item.parkedId}>
            <td>{item.carNumber}</td>
            <td>{item.slotNumber}</td>
            <td>{new Date(item.entryTime).toLocaleString()}</td>
            <td>
              <button onClick={() => handleUnpark(item.carNumber)}>
                Unpark
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
