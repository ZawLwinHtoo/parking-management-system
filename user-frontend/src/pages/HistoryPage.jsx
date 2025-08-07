import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import { getHistory } from "../api/parking"; // Import API call for parking history
import HistoryTable from "../components/HistoryTable"; // Import HistoryTable component

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const fetchHistory = () => {
    getHistory(userId)
      .then(res => setHistoryList(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect to login page on logout
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar Component */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div
        style={{
          marginLeft: '250px', // Make room for the sidebar
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)',
          paddingTop: '20px', // Optional: Ensure some padding at the top
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold text-light" style={{ textShadow: '0 2px 10px #0005' }}>
              Parking History
            </h1>
            <p className="lead mb-3 text-info">
              Parking history of <b>{user.fullName || user.username}</b>
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12">
              <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}>
                <div className="card-body">
                  <HistoryTable historyList={historyList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
