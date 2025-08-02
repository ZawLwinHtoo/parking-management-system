import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---- Stat Widget ----
function StatCard({ label, value, emoji }) {
  return (
    <div
      style={{
        background: "#202746",
        borderRadius: 18,
        padding: 28,
        color: "#fff",
        minWidth: 160,
        flex: "1 1 180px",
        margin: "0 18px 18px 0",
        boxShadow: "0 3px 18px #1113",
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 6 }}>
        {emoji} {value}
      </div>
      <div>{label}</div>
    </div>
  );
}

// ---- Robust Date Filtering ----
function isWithin(dateString, period) {
  if (!dateString) return false;
  const now = new Date();
  const d = new Date(dateString);

  // --- Today
  if (period === "day") {
    return d.toDateString() === now.toDateString();
  }

  // --- Month: All days in this month
  if (period === "month") {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  }

  // --- Week: Only days since latest Monday AND also within this month
  if (period === "week") {
    const weekStart = new Date(now);
    // Set to Monday (if Sunday, get previous Monday)
    const day = weekStart.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);

    // Only accept if session is after this week's Monday AND also within this month
    return (
      d >= weekStart &&
      d <= now &&
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  }

  // --- All time
  return true;
}

// ---- Analytics Section ----
function AnalyticsSection() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/sessions").then((res) => res.json()).then(setSessions);
  }, []);

  // Filtered Sessions
  const filtered = sessions.filter(
    (s) => s.entryTime && isWithin(s.entryTime, filter)
  );

  // Stats
  const totalSessions = filtered.length;
  const totalRevenue = filtered.reduce(
    (acc, s) => acc + (parseFloat(s.fee) || 0),
    0
  );
  const activeSessions = filtered.filter((s) => !s.exitTime).length;

  // Busiest Slot/Building
  const slotCounts = {};
  const buildingCounts = {};
  const buildingRevenue = {};
  filtered.forEach((s) => {
    const slotKey = `${s.building || "Unknown"} / ${s.slotNumber || "Unknown"}`;
    slotCounts[slotKey] = (slotCounts[slotKey] || 0) + 1;

    const building = s.building || "Unknown";
    buildingCounts[building] = (buildingCounts[building] || 0) + 1;
    buildingRevenue[building] =
      (buildingRevenue[building] || 0) + (parseFloat(s.fee) || 0);
  });

  const busiestSlot =
    Object.entries(slotCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const busiestBuilding =
    Object.entries(buildingCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const revenueData = Object.entries(buildingRevenue).map(
    ([building, rev]) => ({
      building,
      revenue: rev,
    })
  );

  // Filter buttons
  const filters = [
    { label: "Today", value: "day" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          marginTop: 38,
          alignItems: "center",
        }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              background: filter === f.value ? "#4263eb" : "#222944",
              color: filter === f.value ? "#fff" : "#b6cdfc",
              border: "none",
              borderRadius: 9,
              padding: "8px 20px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              transition: "background .17s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: 6,
          marginBottom: 40,
        }}
      >
        <StatCard label="Total Sessions" value={totalSessions} emoji="🅿️" />
        <StatCard
          label="Total Revenue"
          value={totalRevenue.toFixed(2)}
          emoji="💰"
        />
        <StatCard label="Active Sessions" value={activeSessions} emoji="🚗" />
        <StatCard label="Busiest Slot" value={busiestSlot} emoji="📍" />
        <StatCard label="Busiest Building" value={busiestBuilding} emoji="🏢" />
      </div>
      <div
        style={{
          background: "#202746",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 3px 18px #1113",
          marginTop: 8,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 20,
            color: "#b6cdfc",
            marginBottom: 16,
          }}
        >
          Revenue by Building
        </div>
        <ResponsiveContainer width="100%" height={290}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="2 4" />
            <XAxis dataKey="building" stroke="#c8e2ff" />
            <YAxis stroke="#c8e2ff" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4b8bfd" radius={[7, 7, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---- Card UI ----
function Card({ title, link, icon }) {
  return (
    <a
      href={link}
      className="dashboard-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 170,
        borderRadius: 22,
        boxShadow: "0 2px 18px #0004",
        background: "linear-gradient(135deg, #26273a 80%, #344a7b 100%)",
        color: "#fff",
        textDecoration: "none",
        fontWeight: 600,
        transition: "box-shadow 0.22s, transform 0.19s cubic-bezier(.36,1.7,.39,.93)",
        padding: "30px 24px 26px 24px",
        position: "relative",
      }}
    >
      <span
        style={{ fontSize: 39, marginBottom: 18, userSelect: "none" }}
      >
        {icon}
      </span>
      <div
        style={{
          fontSize: 23,
          marginBottom: 8,
          fontWeight: 700,
          letterSpacing: ".01em",
        }}
      >
        {title}
      </div>
      <span
        className="dashboard-view-btn"
        style={{
          color: "#4c6ef5",
          background: "rgba(76,110,245,0.12)",
          borderRadius: 9,
          fontWeight: 700,
          fontSize: 17,
          padding: "7px 34px",
          marginTop: 10,
          textDecoration: "none",
          boxShadow: "0 1px 7px #232e4430",
          border: "none",
          display: "inline-block",
          cursor: "pointer",
        }}
      >
        View
      </span>
    </a>
  );
}

// ---- Dashboard Main ----
const CARD_DATA = [
  { title: "Users", link: "/users", icon: "👤" },
  { title: "Buildings", link: "/buildings", icon: "🏢" },
  { title: "Slots", link: "/slots", icon: "🅿️" },
  { title: "Sessions", link: "/sessions", icon: "⏳" },
  { title: "Feedback", link: "/feedback", icon: "💬" },
];

const Dashboard = () => (
  <div
    style={{
      width: "100%",
      minHeight: "100vh",
      background: "linear-gradient(120deg, #25263b 70%, #283148 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 54,
      paddingLeft: 0,
    }}
  >
    <div style={{ width: "100%", maxWidth: 1100, marginLeft: 0 }}>
      <h1
        style={{
          color: "#fff",
          fontSize: "3.1rem",
          marginBottom: 13,
          fontWeight: 800,
          letterSpacing: ".01em",
          textShadow: "0 2px 12px #13213e25",
        }}
      >
        Admin Parking Dashboard
      </h1>
      <p
        style={{
          color: "#b7c5e1",
          marginBottom: 45,
          fontSize: 19,
          letterSpacing: ".01em",
          opacity: 0.95,
        }}
      >
        Quick overview of your system.
      </p>
      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "48px 48px",
          justifyContent: "center",
        }}
      >
        {CARD_DATA.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </div>
      {/* Analytics/Reports section */}
      <AnalyticsSection />
      <style>
        {`
          .dashboard-grid {
            margin-top: 0;
          }
          @media (max-width: 900px) {
            .dashboard-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
          }
          .dashboard-card:hover {
            transform: translateY(-8px) scale(1.035);
            box-shadow: 0 8px 32px #313e6345;
          }
          .dashboard-view-btn {
            transition: background 0.16s, color 0.16s, box-shadow 0.14s;
          }
          .dashboard-view-btn:hover {
            background: linear-gradient(90deg, #4263eb 60%, #3bc9db 120%);
            color: #fff;
            box-shadow: 0 2px 12px #23b6ee48;
          }
        `}
      </style>
    </div>
  </div>
);

export default Dashboard;
