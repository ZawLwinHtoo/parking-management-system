import React from 'react'

export default function HistoryTable({ historyList }) {
  if (!historyList.length) {
    return <p>No parking history.</p>
  }

  return (
    <table border="1" cellSpacing="0" cellPadding="8">
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
  )
}
