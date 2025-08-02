import React from "react";
import { NavLink } from "react-router-dom";

// You can move this to your CSS if you want, but for in-file JS, it's here:
const navStyle = ({ isActive }) => ({
  padding: "10px 18px",
  borderRadius: 8,
  background: isActive ? "#3742fa" : "transparent",
  color: isActive ? "#fff" : "#c0c6ce",
  fontWeight: 600,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 10,
  transition: "background 0.2s"
});

const Sidebar = ({ onLogout }) => (
  <nav
    style={{
      position: "fixed",         // FIXED POSITION!
      left: 0,
      top: 0,
      bottom: 0,
      width: 220,
      background: "#23242a",
      color: "#fff",
      padding: "2rem 1rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      minHeight: "100vh",
      zIndex: 100,              // Make sure it's on top of content
      boxShadow: "2px 0 24px #0003",
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 24,
        marginBottom: 32,
        textAlign: "center"
      }}
    >
      Parking Admin
    </div>
    <NavLink to="/" style={navStyle} end>
      Dashboard
    </NavLink>
    <NavLink to="/users" style={navStyle}>
      Users
    </NavLink>
    <NavLink to="/buildings" style={navStyle}>
      Buildings
    </NavLink>
    <NavLink to="/slots" style={navStyle}>
      Slots
    </NavLink>
    <NavLink to="/sessions" style={navStyle}>
      Sessions
    </NavLink>
    <NavLink to="/feedback" style={navStyle}>
      Feedback
    </NavLink>
    <NavLink to="/profile" style={navStyle}>
      <span role="img" aria-label="profile" style={{ fontSize: 20, marginRight: 2 }}>
        👤
      </span>
      <span style={{ color: "#61dafb", fontWeight: 600 }}>Profile</span>
    </NavLink>
    <button
      onClick={onLogout}
      style={{
        marginTop: "auto",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "10px 0",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 16
      }}
    >
      Logout
    </button>
  </nav>
);

export default Sidebar;
