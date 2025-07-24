import React from 'react'

export default function HistoryTable({ historyList }) {
  if (!historyList.length) {
    return <div className="alert alert-secondary text-center mb-0">No parking history.</div>
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped table-bordered mb-0">
        <thead>
          <tr>
            <th>Car Number</th>
            <th>Slot</th>
            <th>Exit Time</th>
            <th>Fee Paid</th>
          </tr>
        </thead>
        <tbody>
          {historyList.map(item => (
            <tr key={item.parkedId}>
              <td>{item.carNumber}</td>
              <td>{item.slotNumber}</td>
              <td>{new Date(item.exitTime).toLocaleString()}</td>
              <td>{item.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
