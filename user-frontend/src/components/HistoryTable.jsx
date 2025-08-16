import React, { useMemo, useState } from 'react';

export default function HistoryTable({ historyList = [] }) {
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('exitTime');  // 'exitTime' | 'entryTime' | 'fee'
  const [sortDir, setSortDir] = useState('desc');    // 'asc' | 'desc'

  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : '—');
  const fmtMMK = (v) => {
    const n = Number(v);
    if (!isFinite(n)) return v ?? '—';
    return `${n.toLocaleString()} MMK`;
  };

  const summary = useMemo(() => {
    const total = (historyList || []).reduce((acc, x) => acc + (Number(x.fee) || 0), 0);
    return { count: historyList.length, totalFee: total };
  }, [historyList]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return historyList;
    return historyList.filter((item) => {
      const car = String(item.carNumber || '').toLowerCase();
      const slot = String(item.slotNumber || '').toLowerCase();
      const bldg = String(item.buildingName || '').toLowerCase();
      const entry = item.entryTime ? new Date(item.entryTime).toLocaleString().toLowerCase() : '';
      const exit  = item.exitTime  ? new Date(item.exitTime ).toLocaleString().toLowerCase() : '';
      const fee   = item.fee != null ? String(item.fee).toLowerCase() : '';
      return car.includes(t) || slot.includes(t) || bldg.includes(t) || entry.includes(t) || exit.includes(t) || fee.includes(t);
    });
  }, [q, historyList]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;

    arr.sort((a, b) => {
      let av, bv;
      if (sortBy === 'fee') {
        av = Number(a.fee) || 0; bv = Number(b.fee) || 0;
      } else if (sortBy === 'entryTime') {
        av = a.entryTime ? new Date(a.entryTime).getTime() : 0;
        bv = b.entryTime ? new Date(b.entryTime).getTime() : 0;
      } else {
        av = a.exitTime ? new Date(a.exitTime).getTime() : 0;
        bv = b.exitTime ? new Date(b.exitTime).getTime() : 0;
      }
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const hasAny = historyList.length > 0;

  return (
    <>
      {/* Toolbar */}
      {hasAny && (
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
          <form className="flex-grow-1" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control form-control-sm bg-dark text-light"
              placeholder="Search by car, slot, building, date, or fee…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>

          <div className="d-flex align-items-center gap-2">
            <div className="input-group input-group-sm" style={{ width: 260 }}>
              <label className="input-group-text bg-dark text-secondary border-secondary">Sort</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="exitTime">Exit Time</option>
                <option value="entryTime">Entry Time</option>
                <option value="fee">Fee</option>
              </select>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>

            <span className="badge bg-secondary">
              {summary.count} records
            </span>
            <span className="badge bg-info text-dark">
              {fmtMMK(summary.totalFee)}
            </span>
          </div>
        </div>
      )}

      {/* Table / Empty State */}
      <div className="table-responsive" style={{ maxHeight: 520, overflowY: 'auto' }}>
        {!hasAny ? (
          <div className="alert alert-secondary text-center mb-0">
            No parking history.
          </div>
        ) : (
          <table className="table table-dark table-striped table-bordered mb-0 align-middle">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Car Number</th>
                <th>Building</th>
                <th>Slot</th>
                <th style={{ minWidth: 170 }}>Entry Time</th>
                <th style={{ minWidth: 170 }}>Exit Time</th>
                <th className="text-end" style={{ width: 120 }}>Fee Paid</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.parkedId}>
                  <td className="fw-semibold">{item.carNumber}</td>
                  <td>
                    <span className="badge bg-secondary-subtle text-light border border-secondary">
                      {item.buildingName || '—'}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-primary">{item.slotNumber}</span>
                  </td>
                  <td className="text-secondary">{fmtDate(item.entryTime)}</td>
                  <td className="text-secondary">{fmtDate(item.exitTime)}</td>
                  <td className="text-end fw-semibold">{fmtMMK(item.fee)}</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    No matches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
