import React from "react";
import { NavLink } from "react-router-dom";

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
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      width: 220,
      background: "#23242a",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      boxShadow: "2px 0 24px #0003",
      zIndex: 100
    }}
  >
    {/* Scrollable area */}
    <div
      style={{
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        flex: "1 1 auto",
        overflowY: "auto",
        minHeight: 0 // lets this area shrink & scroll
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 24,
          marginBottom: 8,
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

      {/* Profile now uses the exact same navStyle */}
      <NavLink to="/profile" style={navStyle}>
        <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
          👤
        </span>
        <span>Profile</span>
      </NavLink>
    </div>

    {/* Sticky footer with Logout always visible */}
    <div
      style={{
        padding: "1rem",
        borderTop: "1px solid #00000033",
        background: "#23242a"
      }}
    >
      <button
        onClick={onLogout}
        style={{
          width: "100%",
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
    </div>
  </nav>
);

export default Sidebar;
