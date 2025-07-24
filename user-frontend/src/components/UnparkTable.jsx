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
    return <div className="alert alert-info text-center mb-0">No cars currently parked.</div>
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped table-bordered mb-0">
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
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleUnpark(item.carNumber)}
                >
                  Unpark
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
