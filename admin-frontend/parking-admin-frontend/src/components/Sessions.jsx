import React, { useEffect, useState } from "react";

// Modal styles
const modalBgStyle = {
  position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
  background: "rgba(24,26,33,0.77)", zIndex: 200, display: "flex",
  alignItems: "center", justifyContent: "center"
};
const modalStyle = {
  background: "#232a4b", borderRadius: 16, minWidth: 410, padding: "30px 36px",
  boxShadow: "0 4px 40px #000a", color: "#fff"
};

function groupSlotsByBuilding(slots) {
  // 1. Group slots by buildingName
  const grouped = slots.reduce((acc, slot) => {
    const building = slot.buildingName || "Unknown";
    if (!acc[building]) acc[building] = [];
    acc[building].push(slot);
    return acc;
  }, {});
  // 2. Sort slots by slotNumber within each building
  Object.values(grouped).forEach(slotsArr =>
    slotsArr.sort((a, b) => {
      // Extract the numeric part for correct sorting (e.g. S2 < S10)
      const aNum = parseInt(a.slotNumber.replace(/\D/g, "")) || 0;
      const bNum = parseInt(b.slotNumber.replace(/\D/g, "")) || 0;
      return aNum - bNum;
    })
  );
  // 3. Sort buildings alphabetically (optional)
  return Object.fromEntries(
    Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
  );
}



export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [editing, setEditing] = useState(null); // session being edited
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => { fetchSessions(); fetchUsers(); fetchSlots(); }, []);
  const fetchSessions = () =>
    fetch("/api/sessions").then(res => res.json()).then(setSessions);
  const fetchUsers = () =>
    fetch("/api/users").then(res => res.json()).then(setUsers);
  const fetchSlots = () =>
    fetch("/api/slots").then(res => res.json()).then(setSlots);

  // Open edit modal
  const openEdit = (s) => {
    setEditForm({
      carNumber: s.carNumber, fee: s.fee, entryTime: s.entryTime, exitTime: s.exitTime,
      userId: s.userId, slotId: s.slotId,
    });
    setEditing(s);
  };
  // Handle form changes
  const handleChange = e => {
    let { name, value } = e.target;
    if (name === "fee") value = parseFloat(value) || 0;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this session?")) return;
  await fetch(`/api/sessions/${id}`, { method: "DELETE" });
  fetchSessions();
  };


  // Save changes
  const saveEdit = async () => {
    setLoading(true);
    await fetch(`/api/sessions/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    });
    setLoading(false);
    setEditing(null);
    fetchSessions();
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#181a21",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#171d2b", borderRadius: 24, boxShadow: "0 6px 42px #0009",
        padding: 36, minWidth: 970, maxWidth: "99vw"
      }}>
        <h2 style={{
          fontWeight: 900, fontSize: 32, marginBottom: 26, letterSpacing: "0.5px", color: "#4b8bfd"
        }}>
          🚗 Parking Sessions
        </h2>
        <div style={{
          overflowX: "auto", borderRadius: 15, background: "#202746", boxShadow: "0 2px 20px #1113"
        }}>
          <table style={{
            width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 17,
            color: "#fff", minWidth: 900, overflow: "hidden"
          }}>
            <thead>
              <tr style={{
                background: "#232a4b", color: "#b6cdfc", fontSize: 18, fontWeight: 800, letterSpacing: 0.4
              }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Slot</th>
                <th style={thStyle}>Building</th>
                <th style={thStyle}>Car</th>
                <th style={thStyle}>Entry</th>
                <th style={thStyle}>Exit</th>
                <th style={thStyle}>Fee</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={9} style={{
                    textAlign: "center", color: "#eee", padding: "38px 0", fontSize: 19
                  }}>No sessions found.</td>
                </tr>
              )}
              {sessions.map((s, idx) => (
                <tr key={s.id}
                  style={{
                    background: idx % 2 ? "#20253c" : "#262d47",
                    transition: "background 0.15s", cursor: "pointer"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#344170"}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 ? "#20253c" : "#262d47"}
                >
                  <td style={tdStyle}>{s.id}</td>
                  <td style={tdStyle}>{s.userName}</td>
                  <td style={tdStyle}>{s.slotNumber}</td>
                  <td style={tdStyle}>{s.building}</td>
                  <td style={tdStyle}>{s.carNumber}</td>
                  <td style={tdStyle}>{s.entryTime ? new Date(s.entryTime).toLocaleString() : ""}</td>
                  <td style={tdStyle}>{s.exitTime ? new Date(s.exitTime).toLocaleString() : ""}</td>
                  <td style={tdStyle}>{s.fee || "-"}</td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        background: "#4b8bfd", color: "#fff", border: "none", borderRadius: 7,
                        padding: "6px 18px", fontWeight: 800, cursor: "pointer", marginRight: 8
                      }}
                      onClick={() => openEdit(s)}
                    >Edit</button>
                    <button
                      style={{
                        background: "#eb4c4c", color: "#fff", border: "none", borderRadius: 7,
                        padding: "6px 16px", fontWeight: 800, cursor: "pointer"
                      }}
                      onClick={() => handleDelete(s.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
        {/* --- Edit Modal --- */}
        {editing &&
          <div style={modalBgStyle}>
            <div style={modalStyle}>
              <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Edit Session</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                <label>
                  Car Number:
                  <input name="carNumber" value={editForm.carNumber || ""} onChange={handleChange}
                    style={inputStyle} />
                </label>
                <label>
                  Fee:
                  <input name="fee" type="number" value={editForm.fee || ""} onChange={handleChange}
                    style={inputStyle} min="0" step="0.01" />
                </label>
                <label>
                  Entry Time:
                  <input name="entryTime" type="datetime-local"
                    value={editForm.entryTime ? toLocalInput(editForm.entryTime) : ""}
                    onChange={handleChange} style={inputStyle} />
                </label>
                <label>
                  Exit Time:
                  <input name="exitTime" type="datetime-local"
                    value={editForm.exitTime ? toLocalInput(editForm.exitTime) : ""}
                    onChange={handleChange} style={inputStyle} />
                </label>
                <label>
                  User:
                  <select name="userId" value={editForm.userId || ""} onChange={handleChange} style={inputStyle}>
                    <option value="">Select User</option>
                    {users.map(u =>
                      <option key={u.id} value={u.id}>{u.fullName || u.username}</option>
                    )}
                  </select>
                </label>
                <label>
                  Slot:
                  <select
                    name="slotId"
                    value={editForm.slotId || ""}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Select Slot</option>
                    {Object.entries(groupSlotsByBuilding(slots)).map(([building, slotsArr]) => (
                      <optgroup key={building} label={building}>
                        {slotsArr.map(sl => (
                          <option key={sl.id} value={sl.id}>
                            {sl.slotNumber} ({building})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>


                </label>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setEditing(null)} style={{
                  background: "#333", color: "#fff", border: "none", borderRadius: 7, padding: "7px 18px"
                }}>Cancel</button>
                <button onClick={saveEdit} disabled={loading} style={{
                  background: "#4b8bfd", color: "#fff", border: "none", borderRadius: 7,
                  padding: "7px 18px", fontWeight: 700, opacity: loading ? 0.6 : 1, cursor: "pointer"
                }}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

// Helper: format date for datetime-local input
function toLocalInput(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // for local input
  return d.toISOString().slice(0, 16);
}

const thStyle = {
  padding: "15px 14px", border: "none", textAlign: "left",
  position: "sticky", top: 0, background: "#232a4b", zIndex: 2
};
const tdStyle = {
  padding: "13px 14px", border: "none", fontWeight: 500, verticalAlign: "middle"
};
const inputStyle = {
  width: "100%", margin: "7px 0", padding: "8px 10px", fontSize: 16,
  borderRadius: 6, border: "1.4px solid #4b8bfd77", background: "#23293f", color: "#fff", outline: "none"
};
