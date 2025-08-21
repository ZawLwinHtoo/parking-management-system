import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

const AvatarToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    className="btn p-0 border-0 bg-transparent position-relative"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    aria-label="Profile menu"
    type="button"
  >
    {children}
  </button>
));
AvatarToggle.displayName = "AvatarToggle";

export default function GlobalTopbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Always read fresh so changes are reflected without reloads
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const hideOn = ["/login", "/register"];
  const shouldHide = !token || hideOn.some((p) => pathname.startsWith(p));

  const [avatarError, setAvatarError] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const [avatarSrc, setAvatarSrc] = useState("");

  useEffect(() => {
    if (userId) setAvatarSrc(`/api/profile/photo?userId=${userId}&t=${cacheKey}`);
  }, [userId, cacheKey]);

  useEffect(() => setAvatarError(false), [avatarSrc]);

  // listen for profile-updated events to bust avatar cache
  useEffect(() => {
    const bump = () => setCacheKey(Date.now());
    window.addEventListener("profile-updated", bump);
    return () => window.removeEventListener("profile-updated", bump);
  }, []);

  if (shouldHide) return null;

  const initials = ((user.fullName || user.username || "U").trim())
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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
        <Dropdown.Toggle as={AvatarToggle} id="global-topbar-dropdown">
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

        <Dropdown.Menu className="shadow">
          <div className="dropdown-header small">
            Signed in as <b>{user.fullName || user.username}</b>
          </div>
          <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="text-danger" onClick={logout}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
