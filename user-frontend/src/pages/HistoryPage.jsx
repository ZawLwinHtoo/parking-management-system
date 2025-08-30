import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getHistory } from "../api/parking";
import HistoryTable from "../components/HistoryTable";
import { SIDEBAR_WIDTH } from '../constants/layout';

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const fetchHistory = () => {
    getHistory(userId)
      .then((res) => setHistoryList(res.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`, // Keeps content aligned next to sidebar
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)',
          padding: '20px',
        }}
      >
        <div className="container py-5">
          {/* Title and Refresh Button */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="text-center text-md-start">
              <h1 className="fw-bold text-light m-0" style={{ textShadow: '0 2px 10px #0005' }}>
                Parking History
              </h1>
            </div>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={fetchHistory}
            >
              Refresh
            </button>
          </div>

          {/* Card for Parking History */}
          <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}>
            <div
              className="card-body"
              style={{
                background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)',
                borderRadius: '12px', // Added border-radius here
                padding: '20px',
              }}
            >
              {/* History Table */}
              <HistoryTable historyList={historyList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
