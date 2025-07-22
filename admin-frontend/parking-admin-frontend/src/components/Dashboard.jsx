import React from "react";

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
      <span style={{ fontSize: 39, marginBottom: 18, userSelect: "none" }}>{icon}</span>
      <div style={{ fontSize: 23, marginBottom: 8, fontWeight: 700, letterSpacing: ".01em" }}>{title}</div>
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

export default Dashboard;
