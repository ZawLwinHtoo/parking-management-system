import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GlobalTopbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const userId = user?.id;

  const hideOn = ["/login", "/register", "/profile"];
  const shouldHide = !token || hideOn.some((p) => location.pathname.startsWith(p));

  const [avatarError, setAvatarError] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const [avatarSrc, setAvatarSrc] = useState("");

  useEffect(() => {
    if (!userId) return;
    setAvatarSrc(`/api/profile/photo?userId=${userId}&t=${cacheKey}`);
  }, [userId, cacheKey]);

  useEffect(() => setAvatarError(false), [avatarSrc]);

  useEffect(() => {
    const bump = () => setCacheKey(Date.now());
    window.addEventListener("profile-updated", bump);
    return () => window.removeEventListener("profile-updated", bump);
  }, []);

  const initials = ((user.fullName || user.username || "U").trim())
    .split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        display: shouldHide ? "none" : "block",
        position: "absolute",          // <-- no layout space, overlays page
        top: 12,
        right: 16,
        zIndex: 1080,
        background: "transparent",
        pointerEvents: "none",         // wrapper transparent to clicks
      }}
    >
      <div className="dropdown" style={{ pointerEvents: "auto" }}>
        <button
          className="btn p-0 border-0 bg-transparent position-relative"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title={user.fullName || user.username || "Profile"}
        >
          {!avatarError ? (
            <img
              src={avatarSrc}
              alt="avatar"
              width="40"
              height="40"
              className="rounded-circle border border-2 border-secondary"
              onError={() => setAvatarError(true)}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center border border-2 border-secondary text-light"
              style={{ width: 40, height: 40, background: "#3b3f54", fontSize: 14, fontWeight: 700 }}
            >
              {initials}
            </div>
          )}
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li className="dropdown-header small">
            Signed in as <b>{user.fullName || user.username}</b>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
