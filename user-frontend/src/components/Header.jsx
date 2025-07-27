import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">
      <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: 25, letterSpacing: ".02em" }}>
        SPARK
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <span className="nav-link text-light">
              <b>{user.fullName || user.username}</b>
            </span>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-info ms-2" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
