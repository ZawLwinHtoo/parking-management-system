import React, { useState, useEffect } from "react";

const API_URL = "/api/users";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
    fullName: "",
    email: "",
    phone: "",
    profile_image: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setError("Failed to load users"));
  }, []);

  const filtered = users.filter(
    u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_URL}/${editing.id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      const user = await res.json();
      if (editing) {
        setUsers(users.map(u => (u.id === user.id ? user : u)));
      } else {
        setUsers([...users, user]);
      }
      resetForm();
    } catch (e) {
      setError("Error: " + e.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  const handleEdit = user => {
    setEditing(user);
    setForm({
      username: user.username,
      password: "",
      role: user.role,
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      profile_image: user.profile_image || ""
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({
      username: "",
      password: "",
      role: "user",
      fullName: "",
      email: "",
      phone: "",
      profile_image: ""
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setForm({
      username: "",
      password: "",
      role: "user",
      fullName: "",
      email: "",
      phone: "",
      profile_image: ""
    });
  };

  // ---- Styles ----
  const glassBg =
    "linear-gradient(120deg,rgba(44,47,62,0.88),rgba(55,64,105,0.81))";
  const tableContainerStyle = {
    width: "86%",
    minWidth: 300,
    maxWidth: 1100,
    margin: "40px auto 0 auto",
    background: glassBg,
    borderRadius: 22,
    overflowX: "auto",
    boxShadow: "0 8px 40px #1a223d55",
    border: "1.5px solid rgba(76,110,245,0.10)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    paddingBottom: 12,
  };
  const tableStyle = {
    width: "100%",
    color: "#eaf0ff",
    borderRadius: 12,
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 16,
    tableLayout: "auto"
  };
  const thStyle = {
    textAlign: "left",
    padding: "17px 18px",
    background: "transparent",
    fontWeight: 800,
    fontSize: 17.5,
    letterSpacing: ".015em",
    borderBottom: "2px solid #343957",
    color: "#c8d1fa",
    backgroundClip: "padding-box",
  };
  const tdStyle = {
    padding: "13px 18px",
    verticalAlign: "middle",
    background: "transparent",
    fontSize: 16.5,
    fontWeight: 500,
    borderBottom: "1.2px solid #23284044"
  };
  const tdActionsStyle = {
    ...tdStyle,
    minWidth: "148px",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingRight: "22px",
    borderBottom: "none"
  };
  const actionBtn = {
    background: "linear-gradient(90deg,#4263eb 60%,#3bc9db 120%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 22px",
    fontWeight: 700,
    fontSize: 15.5,
    cursor: "pointer",
    boxShadow: "0 2px 8px #4263eb29",
    transition: "background 0.15s, box-shadow 0.13s",
  };
  const deleteBtn = {
    background: "linear-gradient(90deg,#fa5252 65%,#ffb02e 110%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 22px",
    fontWeight: 700,
    fontSize: 15.5,
    cursor: "pointer",
    boxShadow: "0 2px 8px #fa525226",
    transition: "background 0.15s, box-shadow 0.13s",
  };
  const inputStyle = {
    margin: "6px 0 16px 0",
    padding: 13,
    fontSize: 16.5,
    borderRadius: 8,
    border: "1.4px solid #4851b8",
    background: "#212336",
    color: "#eaf0ff",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.17s"
  };
  const formStyle = {
    background: glassBg,
    borderRadius: 17,
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    width: 380,
    boxShadow: "0 4px 44px #232e5040",
    border: "1.5px solid #4263eb30",
    alignItems: "center"
  };

  return (
    <div style={{ width: "100%", padding: "0 36px", boxSizing: "border-box" }}>
      <h2 style={{
        color: "#fff",
        marginTop: 0,
        fontSize: "2.1rem",
        letterSpacing: ".01em",
        fontWeight: 800,
        marginBottom: 8
      }}>Users</h2>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
        flexWrap: "wrap"
      }}>
        <input
          style={{ ...inputStyle, width: 225, margin: 0 }}
          placeholder="Search user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          style={{
            ...actionBtn,
            padding: "10px 28px",
            borderRadius: 10,
            fontSize: 16.5
          }}
          onClick={handleAdd}
        >Add User</button>
        {error && <div style={{ color: "#fa5252", marginLeft: 14 }}>{error}</div>}
      </div>

      {/* TABLE */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr
                key={user.id}
                style={{
                  background: "transparent",
                  transition: "background 0.16s",
                  borderRadius: 13,
                  boxShadow: "none"
                }}
                className="user-row"
              >
                <td style={{ ...tdStyle, paddingLeft: 22 }}>{user.id}</td>
                <td style={tdStyle}>{user.username}</td>
                <td style={{
                  ...tdStyle,
                  color: user.role === "admin" ? "#4c6ef5" : "#3bc9db",
                  fontWeight: 700
                }}>{user.role}</td>
                <td style={tdStyle}>{user.fullName}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.phone}</td>
                <td style={tdActionsStyle}>
                  <button onClick={() => handleEdit(user)} style={actionBtn}>Edit</button>
                  <button onClick={() => handleDelete(user.id)} style={deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div style={{
          position: "fixed",
          left: 0, top: 0, width: "100vw", height: "100vh",
          background: "rgba(34,41,72,0.40)",
          zIndex: 199,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
          animation: "fadein .22s"
        }}>
          <form onSubmit={handleSubmit} style={formStyle}>
            <h3 style={{ color: "#fff", marginBottom: 13, fontWeight: 800 }}>
              {editing ? "Edit User" : "Add User"}
            </h3>
            <input style={inputStyle} name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            {!editing && (
              <input
                style={inputStyle}
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                minLength={3}
                required
              />
            )}
            <select style={inputStyle} name="role" value={form.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <input style={inputStyle} name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
            <input style={inputStyle} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input style={inputStyle} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <div style={{ display: "flex", gap: 13, marginTop: 8 }}>
              <button style={actionBtn} type="submit">{editing ? "Update" : "Add"}</button>
              <button style={deleteBtn} type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table row hover effect */}
      <style>
        {`
          .user-row:hover {
            background: rgba(51, 61, 95, 0.19);
          }
          @media (max-width: 900px) {
            table, thead, tbody, th, td, tr {
              font-size: 15px !important;
            }
            .user-row td {
              padding: 8px 10px !important;
            }
            .user-row th {
              padding: 11px 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
