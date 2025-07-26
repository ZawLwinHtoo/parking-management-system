import React from 'react';

export default function ActiveStatus({ activeList }) {
  if (!activeList.length) {
    return <div className="alert alert-warning mb-0">No active parking sessions.</div>
  }
  return (
    <table className="table table-dark table-striped table-bordered mb-0">
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
  );
}
