import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const linkBase =
    'nav-link d-flex align-items-center rounded-3 px-3 py-2 text-decoration-none';

  const linkStyle = {
    fontSize: '0.95rem',
    lineHeight: 1.1,
    color: '#d8dbe3',
    transition: 'background .15s ease, color .15s ease',
  };

  const activeStyle = {
    background: 'rgba(255,255,255,.08)',
    color: '#fff',
    boxShadow: 'inset 0 0 0 1px rgba(120,150,220,.25)',
    borderLeft: '3px solid #5a7bdc',
  };

  const linkClasses = ({ isActive }) => `${linkBase} ${isActive ? 'active' : ''}`;
  const getItemStyle = (isActive) => ({ ...linkStyle, ...(isActive ? activeStyle : null) });

  return (
    <aside
      className="bg-dark text-light d-flex flex-column"
  style={{
    height: '100vh',
    width: 'var(--sidebar-width)',   // ← use CSS var
    position: 'fixed',
    top: 0,
    left: 0,
    boxShadow: '2px 0 6px rgba(0,0,0,0.45)',
  }}
  data-bs-theme="dark"
    >
      {/* Brand */}
      <div className="px-4 pt-4 pb-3 border-bottom border-secondary">
        <div>
          <h1
            className="m-0 fw-bold"
            style={{
              // slightly larger + responsive, uses your Poppins heading font
              fontFamily: 'var(--brand-heading, Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif)',
              fontSize: 'clamp(2.25rem, 2rem + 0.8vw, 2.8rem)',
              letterSpacing: '1px',
              lineHeight: 1,
            }}
          >
            SPARK
          </h1>
          <small
            className="text-secondary text-uppercase"
            style={{ letterSpacing: '0.12rem', fontSize: '0.7rem' }}
          >
            Smart Parking
          </small>
        </div>

       
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 overflow-auto px-2 py-3">
        <ul className="nav nav-pills flex-column gap-1">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              end
              className={linkClasses}
              style={({ isActive }) => getItemStyle(isActive)}
            >
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/active"
              className={linkClasses}
              style={({ isActive }) => getItemStyle(isActive)}
            >
              <span>Active Status</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/history"
              className={linkClasses}
              style={({ isActive }) => getItemStyle(isActive)}
            >
              <span>Parking History</span>
            </NavLink>
          </li>
          <li className="nav-item">
          <NavLink to="/about" className={linkClasses} style={({ isActive }) => getItemStyle(isActive)}>
              <span>About</span>
          </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/contact"
              className={linkClasses}
              style={({ isActive }) => getItemStyle(isActive)}
            >
              <span>Contact</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/profile"
              className={linkClasses}
              style={({ isActive }) => getItemStyle(isActive)}
            >
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 pb-4 pt-2 border-top border-secondary">
        <button
          onClick={onLogout}
          className="btn btn-outline-light w-100 fw-semibold py-2 rounded-3"
          style={{ fontSize: '.9rem' }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
