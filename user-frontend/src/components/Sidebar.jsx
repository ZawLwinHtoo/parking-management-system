import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Base style for nav links
  const navStyle = ({ isActive }) => ({
    padding: "12px 24px",
    borderRadius: 8,
    background: isActive ? "#3742fa" : "transparent",
    color: isActive ? "#fff" : "#c0c6ce",
    fontWeight: 600,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 12,
    transition: "background 0.3s",
  });

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "320px",  /* Expanded sidebar width */
        background: "#23242a",
        color: "#fff",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        minHeight: "100vh",
        zIndex: 100,
        boxShadow: "2px 0 24px #0003",
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontWeight: 700,
          fontSize: 30,  /* Increased font size */
          marginBottom: 32,
          textAlign: "center"
        }}
      >
        SPARK
      </div>

      {/* Navigation Links */}
      <NavLink to="/dashboard" style={navStyle} end>
        Dashboard
      </NavLink>
      <NavLink to="/active" style={navStyle}>
        Active Status
      </NavLink>
      <NavLink to="/history" style={navStyle}>
        Parking History
      </NavLink>
      <NavLink to="/about" style={navStyle}>
        About
      </NavLink>
      <NavLink to="/contact" style={navStyle}>
        Contact
      </NavLink>
      <NavLink to="/profile" style={navStyle}>
        <span role="img" aria-label="profile" style={{ fontSize: 20, marginRight: 2 }}>
          👤
        </span>
        <span style={{ color: "#61dafb", fontWeight: 600 }}>Profile</span>
      </NavLink>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          marginTop: "auto",
          background: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "12px 0",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Logout
      </button>
    </nav>
  );
}
