import React, { useEffect, useState } from "react";

const API_URL = "/api/buildings";

export default function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", address: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(setBuildings);
  }, []);

  const reload = () => {
    fetch(API_URL)
      .then(r => r.json())
      .then(setBuildings);
  };

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleOpenForm(edit) {
    setError("");
    setShowForm(true);
    setEditing(edit);
    setForm(edit || { name: "", location: "", address: "" });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(editing ? `${API_URL}/${editing.id}` : API_URL, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const msg = await res.text();
        setError("Error: " + msg);
        return;
      }
      setShowForm(false);
      setEditing(null);
      reload();
    } catch (err) {
      setError("Error: " + err.message);
    }
  }

  async function handleDelete(b) {
    if (!window.confirm(`Delete building "${b.name}"? All slots will be deleted.`)) return;
    await fetch(`${API_URL}/${b.id}`, { method: "DELETE" });
    reload();
  }

  // --- STYLES ---
  const pageStyle = {
    maxWidth: 820,
    margin: "38px auto 0 auto",
    color: "#fff",
    background: "rgba(34,36,42,0.94)",
    borderRadius: 20,
    padding: "32px 28px 38px 28px",
    boxShadow: "0 6px 40px #0005",
    minHeight: 480,
    position: "relative",
  };

  const cardsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "32px",
    marginTop: 30,
  };

  const card = {
    background: "linear-gradient(135deg, #23242a 60%, #272830 100%)",
    borderRadius: 16,
    boxShadow: "0 2px 24px #0002",
    padding: "34px 26px 26px 26px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
    minHeight: 120,
    transition: "transform 0.14s cubic-bezier(.47,1.64,.41,.8), box-shadow 0.16s",
    willChange: "transform",
  };

  const cardTitle = {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: ".02em",
    color: "#b9ebff",
    textShadow: "0 1px 6px #171717a6"
  };

  const iconBtn = {
    background: "none",
    border: "none",
    outline: "none",
    cursor: "pointer",
    fontSize: 21,
    marginLeft: 8,
    transition: "transform 0.13s, color 0.13s",
    verticalAlign: "middle"
  };

  const editBtn = { ...iconBtn, color: "#ffce1a" };
  const delBtn = { ...iconBtn, color: "#ff5b63" };

  const addBtn = {
    background: "linear-gradient(90deg, #4263eb 40%, #3bc9db 90%)",
    color: "#fff", border: 0, borderRadius: 12, padding: "13px 30px",
    fontWeight: 700, fontSize: 16, boxShadow: "0 1px 8px #0002", marginLeft: 16,
    transition: "background .15s, box-shadow .15s",
    cursor: "pointer"
  };

  const searchStyle = {
    flex: 1, padding: 12, borderRadius: 8, border: "1px solid #434455",
    fontSize: 16, background: "#191a1d", color: "#dbeafe"
  };

  const emptyState = {
    margin: "38px 0 0 0",
    textAlign: "center",
    color: "#7887a4",
    fontSize: 18,
    opacity: 0.85
  };

  // Modal styles
  const modalBackdrop = {
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
    background: "rgba(20,22,25,0.67)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
  };
  const modalCard = {
    background: "#20212c",
    borderRadius: 14,
    minWidth: 340,
    maxWidth: 430,
    padding: "38px 32px 30px 32px",
    boxShadow: "0 10px 32px #0007",
    animation: "modalPop .35s cubic-bezier(.57,2.1,.5,.94)"
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: ".01em", color: "#fff" }}>Buildings</h2>
      <div style={{ display: "flex", gap: 18, marginBottom: 4, alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search buildings..."
          style={searchStyle}
        />
        <button onClick={() => handleOpenForm(null)} style={addBtn}>Add Building</button>
      </div>

      <div style={cardsGrid}>
        {filtered.length === 0 &&
          <div style={emptyState}>
            <span>✨ No buildings found. Add your first one!</span>
          </div>
        }
        {filtered.map(b => (
          <div key={b.id} style={card}
            onMouseOver={e => { e.currentTarget.style.transform = "scale(1.028)"; e.currentTarget.style.boxShadow = "0 2px 40px #19b7ff28"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 24px #0002"; }}
          >
            <span style={cardTitle}>{b.name}</span>
            <span style={{ fontSize: 15, color: "#e2e9fa", opacity: 0.83, marginBottom: 12 }}>
              {b.location || <span style={{ opacity: 0.4 }}><i>No location</i></span>}
              {b.address ? <span> · {b.address}</span> : ""}
            </span>
            <div style={{ position: "absolute", top: 12, right: 16, display: "flex" }}>
              <button onClick={() => handleOpenForm(b)} style={editBtn} title="Edit"><span role="img" aria-label="edit">✏️</span></button>
              <button onClick={() => handleDelete(b)} style={delBtn} title="Delete"><span role="img" aria-label="delete">🗑️</span></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={modalBackdrop}>
          <div style={modalCard}>
            <h3 style={{ margin: "0 0 16px 0", color: "#fff" }}>{editing ? "Edit Building" : "Add Building"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Building Name (A1, B2...)"
                maxLength={6}
                required
                pattern="^[A-Z][0-9]+$"
                style={{ padding: 12, borderRadius: 8, border: "1px solid #444", fontSize: 16, background: "#16171b", color: "#fff" }}
              />
              <input
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                placeholder="Location (optional)"
                style={{ padding: 12, borderRadius: 8, border: "1px solid #444", fontSize: 16, background: "#16171b", color: "#fff" }}
              />
              <input
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                placeholder="Address (optional)"
                style={{ padding: 12, borderRadius: 8, border: "1px solid #444", fontSize: 16, background: "#16171b", color: "#fff" }}
              />
              {error && <div style={{ color: "#ff6670", fontWeight: 500, marginTop: -10 }}>{error}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 4 }}>
                <button type="submit" style={{
                  background: "linear-gradient(90deg, #4263eb 40%, #3bc9db 90%)",
                  color: "#fff", border: 0, borderRadius: 9, padding: "10px 32px", fontWeight: 700, fontSize: 16
                }}>{editing ? "Update" : "Add"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} style={{
                  background: "#3b404e", color: "#fff", border: 0, borderRadius: 9, padding: "10px 32px", fontWeight: 700, fontSize: 16
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes modalPop {
          from { opacity:0; transform: scale(.87);}
          to { opacity:1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
