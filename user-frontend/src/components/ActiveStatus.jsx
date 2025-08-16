import React from 'react';

export default function ActiveStatus({ activeList = [] }) {
  if (!activeList.length) {
    return (
      <div className="alert alert-warning mb-0 text-center">
        No active parking sessions.
      </div>
    );
  }

  const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : '—');

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
      {activeList.map((item) => (
        <div className="col" key={item.parkedId}>
          <div
            className="card h-100 shadow-sm border-0 rounded-4"
            data-bs-theme="dark"
            style={{
              background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)',
            }}
          >
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-primary px-3 py-2">
                  Slot&nbsp;{item.slotNumber ?? '—'}
                </span>
                <span className="badge bg-secondary px-3 py-2">
                  {item.buildingName ?? 'Building —'}
                </span>
              </div>

              <div className="mt-1">
                <div className="text-secondary small">Car Number</div>
                <div className="fs-4 fw-bold text-light" style={{ letterSpacing: '0.5px' }}>
                  {item.carNumber}
                </div>
              </div>

              <div className="mt-3 text-secondary small">
                Entry Time: <span className="text-light">{fmt(item.entryTime)}</span>
              </div>

              {/* Optional fee preview if present */}
              {item.fee != null && (
                <div className="mt-2 fw-semibold text-info">
                  Est. Fee:&nbsp;{Number(item.fee).toLocaleString()}&nbsp;MMK
                </div>
              )}

              {/* spacer to push footer to bottom if you add buttons later */}
              <div className="mt-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
