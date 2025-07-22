import React from 'react'

export default function ActiveStatus({ activeList }) {
  if (!activeList.length) {
    return <p>No active parking sessions.</p>
  }

  return (
    <table border="1" cellSpacing="0" cellPadding="8" style={{ marginBottom: '20px' }}>
      <thead>
        <tr>
          <th>Slot #</th>
          <th>Car Number</th>
        </tr>
      </thead>
      <tbody>
        {activeList.map(item => (
          <tr key={item.parkedId}>
            <td>{item.slotNumber}</td>
            <td>{item.carNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
