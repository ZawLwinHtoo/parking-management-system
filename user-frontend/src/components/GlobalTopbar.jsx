import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

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

  if (shouldHide) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 16,
        zIndex: 1080,
        background: "transparent",
      }}
    >
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="link"
          className="p-0 border-0 bg-transparent text-decoration-none"
          id="topbar-user-menu"
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
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <div className="dropdown-header small">
            Signed in as <b>{user.fullName || user.username}</b>
          </div>
          <Dropdown.Item onClick={() => navigate("/profile")}>
            Profile
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="text-danger" onClick={logout}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
