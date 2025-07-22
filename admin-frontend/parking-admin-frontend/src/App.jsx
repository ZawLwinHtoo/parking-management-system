import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Buildings from "./components/Buildings";
import Slots from "./components/Slots";
import Sessions from "./components/Sessions";
import Feedback from "./components/Feedback";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#191a1c", overflowX: "hidden" }}>
        <Sidebar user={user} onLogout={() => setUser(null)} />
        <main style={{
          flex: 1,
          width: "100%",
          minWidth: 0,
          padding: "2rem 0 2rem 0",
          background: "#191a1c",
          display: "flex",
          flexDirection: "column",
        }}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
