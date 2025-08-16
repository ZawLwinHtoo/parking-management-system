import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <aside
      className="bg-dark text-light d-flex flex-column"
      style={{
        height: '100vh',
        width: '280px',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '2px 0 6px rgba(0,0,0,0.45)',
      }}
      data-bs-theme="dark"
    >
      {/* Brand */}
      <div className="px-4 pt-4 pb-3 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          
          <div>
            <h3 className="m-0 fw-bold" style={{ letterSpacing: '0.5px' }}>SPARK</h3>
            <small className="text-secondary">Smart Parking</small>
          </div>
        </div>
        {user?.username && (
          <div className="mt-3 small text-secondary">
            Signed in as <span className="text-light">{user.fullName || user.username}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 overflow-auto px-3 py-3">
        <ul className="nav nav-pills flex-column gap-2">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fs-5 ${
                  isActive ? 'active' : 'text-light'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/active"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fs-5 ${
                  isActive ? 'active' : 'text-light'
                }`
              }
            >
              Active Status
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fs-5 ${
                  isActive ? 'active' : 'text-light'
                }`
              }
            >
              Parking History
            </NavLink>
          </li>

          <div className="border-top border-secondary my-2" />

          <li className="nav-item">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fs-5 ${
                  isActive ? 'active' : 'text-light'
                }`
              }
            >
              Contact
            </NavLink>
          </li>

          {/* Profile link */}
          <li className="nav-item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fs-5 ${
                  isActive ? 'active' : 'text-light'
                }`
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 pb-4 pt-2 border-top border-secondary">
        <button
          onClick={onLogout}
          className="btn btn-outline-light w-100 fw-semibold py-2 rounded-3"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
