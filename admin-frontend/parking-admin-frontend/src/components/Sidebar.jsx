import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ onLogout }) => ( // Make sure to accept onLogout!
  <nav style={{
    width: 220, background: "#23242a", color: "#fff", padding: "2rem 1rem",
    display: "flex", flexDirection: "column", gap: "1.5rem"
  }}>
    <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 32, textAlign: "center" }}>
      Parking Admin
    </div>
    <NavLink to="/" style={navStyle} end>Dashboard</NavLink>
    <NavLink to="/users" style={navStyle}>Users</NavLink>
    <NavLink to="/buildings" style={navStyle}>Buildings</NavLink>
    <NavLink to="/slots" style={navStyle}>Slots</NavLink>
    <NavLink to="/sessions" style={navStyle}>Sessions</NavLink>
    <NavLink to="/feedback" style={navStyle}>Feedback</NavLink>
    <NavLink
      to="/profile"  style={{ color: "#61dafb", fontWeight: 600 }}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      <span role="img" aria-label="profile">👤</span> Profile
    </NavLink>


    <button onClick={onLogout} style={{
      marginTop: "auto",
      background: "#e74c3c",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 0",
      fontWeight: 700,
      cursor: "pointer"
    }}>Logout</button>
  </nav>
);

const navStyle = ({ isActive }) => ({
  padding: "10px 18px",
  borderRadius: 8,
  background: isActive ? "#3742fa" : "transparent",
  color: isActive ? "#fff" : "#c0c6ce",
  fontWeight: 600,
  textDecoration: "none",
  transition: "background 0.2s"
});

export default Sidebar;
