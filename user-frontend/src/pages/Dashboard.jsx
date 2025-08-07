import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import ParkForm from "../components/ParkForm";
import UnparkTable from "../components/UnparkTable";
import ActiveStatus from "../components/ActiveStatus";
import HistoryTable from "../components/HistoryTable";
import { getActive, getHistory } from "../api/parking";

export default function Dashboard() {
  const [activeList, setActiveList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const fetchActive = () => {
    getActive(userId)
      .then(res => setActiveList(res.data))
      .catch(console.error);
  };

  const fetchHistory = () => {
    getHistory(userId)
      .then(res => setHistoryList(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchActive();
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
              Parking Dashboard
            </h1>
            <p className="lead mb-3 text-info">
              Welcome, <b>{user.fullName || user.username}</b>
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12">
              <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}>
                <div className="card-body">
                  <h4 className="mb-3 text-primary fw-bold">🚗 Park Your Car</h4>
                  <ParkForm
                    userId={userId}
                    onSuccess={() => {
                      fetchActive();
                      fetchHistory();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Unpark Section with Table UI ONLY */}
            <div className="col-12 col-md-6">
              <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}>
                <div className="card-body">
                  <h4 className="mb-3 text-warning fw-bold">🅿️ Unpark My Car</h4>
                  <UnparkTable
                    activeList={activeList}
                    onUnpark={() => {
                      fetchActive();
                      fetchHistory();
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}>
                <div className="card-body">
                  <h4 className="mb-3 text-success fw-bold">⏳ Active Parking Status</h4>
                  <ActiveStatus activeList={activeList} />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-lg border-0 rounded-4" style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}>
                <div className="card-body">
                  <h4 className="mb-3 text-info fw-bold">🕓 Parking History</h4>
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
