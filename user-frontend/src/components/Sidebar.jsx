import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  return (
    <div
      className="d-flex flex-column bg-dark text-light p-3"
      style={{
        height: '100vh',
        width: '250px',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)', // Optional: Adds shadow to the sidebar
      }}
    >
      {/* Sidebar Header */}
      <div className="text-center mb-4">
        <h4>SPARK</h4>
      </div>

      {/* Sidebar Navigation */}
      <nav className="nav flex-column">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-light">
            🚗 Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/active" className="nav-link text-light">
            ⏳ Active Parking Status
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/history" className="nav-link text-light">
            🕓 Parking History
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link text-light">
            📞 Contact Us
          </Link>
        </li>
        <li className="nav-item">
          <button className="nav-link btn btn-link text-light" onClick={onLogout}>
            Logout
          </button>
        </li>
      </nav>
    </div>
  );
}
