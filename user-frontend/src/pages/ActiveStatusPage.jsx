import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getActive } from "../api/parking";
import ActiveStatus from "../components/ActiveStatus";
import { SIDEBAR_WIDTH } from '../constants/layout';

export default function ActiveStatusPage() {
  const [activeList, setActiveList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const fetchActive = () => {
    getActive(userId)
      .then(res => setActiveList(res.data || []))
      .catch(console.error);
  };

  useEffect(() => { fetchActive(); /* eslint-disable-next-line */ }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />

      <div
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)',
          paddingTop: '20px',
        }}
      >
        <div className="container py-5">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="text-center text-md-start">
              <h1 className="fw-bold text-light m-0" style={{ textShadow: '0 2px 10px #0005' }}>
                Active Parking Status
              </h1>
              <p className="lead mb-0 text-info">
                Active parking spots for <b>{user.fullName || user.username}</b>
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary fs-6 px-3 py-2">
                Total: <span className="fw-semibold">{activeList.length}</span>
              </span>
              <button className="btn btn-outline-light" onClick={fetchActive}>
                Refresh
              </button>
            </div>
          </div>

          <div className="card shadow-lg border-0 rounded-4">
            <div
              className="card-body"
              style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}
            >
              <ActiveStatus activeList={activeList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
