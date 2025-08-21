import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ParkForm from "../components/ParkForm";
import UnparkTable from "../components/UnparkTable";
import { getActive, getHistory } from "../api/parking";

export default function Dashboard() {
  const [activeList, setActiveList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const fetchActive = () => getActive(userId).then((r) => setActiveList(r.data)).catch(console.error);
  const fetchHistory = () => getHistory(userId).then((r) => setHistoryList(r.data)).catch(console.error);

  useEffect(() => {
    fetchActive();
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onLogout={handleLogout} />

      <main className="page-main">
        <div className="container-fluid page-container py-5">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="text-center text-md-start">
              <h1 className="fw-bold text-light mb-1" style={{ textShadow: "0 2px 10px #0005" }}>
                Dashboard
              </h1>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <div className="badge bg-secondary fs-6 px-3 py-2">
                Active: <span className="fw-semibold">{activeList.length}</span>
              </div>
              <div className="badge bg-secondary fs-6 px-3 py-2">
                History: <span className="fw-semibold">{historyList.length}</span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-xl-5">
              <div className="card shadow-lg border-0 rounded-4 h-100"
                   style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="mb-0 text-primary fw-bold">Park Your Car</h4>
                    <small className="text-light-50">Select building & slot</small>
                  </div>
                  <ParkForm
                    userId={userId}
                    onSuccess={() => { fetchActive(); fetchHistory(); }}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-7">
              <div className="card shadow-lg border-0 rounded-4 h-100"
                   style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="mb-0 text-warning fw-bold">Unpark My Car</h4>
                    <button className="btn btn-outline-light btn-sm" onClick={() => { fetchActive(); fetchHistory(); }}>
                      Refresh
                    </button>
                  </div>

                  <UnparkTable
                    activeList={activeList}
                    onUnpark={() => { fetchActive(); fetchHistory(); }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
