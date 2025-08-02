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
import Profile from "./components/AdminProfile"; // Adjust path as needed

// --- Avatar display in top right ---
function TopRightAvatar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarUrl = user.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : user.profileImage
    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName || user.username || "Admin");
  return (
    <div style={{
      position: "absolute",
      right: 44,
      top: 24,
      display: "flex",
      alignItems: "center",
      gap: 12,
      zIndex: 99
    }}>
      <img
        src={avatarUrl}
        alt="avatar"
        style={{
          width: 46, height: 46, borderRadius: "50%", objectFit: "cover",
          border: "2.5px solid #4b8bfd", boxShadow: "0 1px 8px #2227"
        }}
      />
    </div>
  );
}

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
      <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#191a1c", overflowX: "hidden", position: "relative" }}>
        <Sidebar user={user} onLogout={() => setUser(null)} />
        {/* --- Profile Avatar in top right --- */}
        <TopRightAvatar />
        <main style={{
          flex: 1,
          width: "100%",
          minWidth: 0,
          padding: "2rem 0 2rem 0",
          background: "#191a1c",
          display: "flex",
          flexDirection: "column",
          marginLeft: 220, // <-- ADD THIS LINE (must match Sidebar width)
        }}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
