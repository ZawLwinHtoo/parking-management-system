import React, { useState, useEffect } from "react";
import Parking3DView from "./Parking3DView";

const API_SLOTS = "/api/slots";
const API_BUILDINGS = "/api/buildings";

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    buildingId: "",
    slotNumber: "",
    slotType: "",
    location: "",
    isAvailable: true,
    isOccupied: false,
  });
  const [error, setError] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState("");

  // Fetch buildings
  useEffect(() => {
    fetch(API_BUILDINGS)
      .then(res => res.json())
      .then(setBuildings)
      .catch(() => setBuildings([]));
  }, []);

  // Fetch slots
  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    fetch(API_SLOTS)
      .then(res => res.json())
      .then(setSlots)
      .catch(() => setSlots([]));
  };

  // Helper: used slot numbers for selected building
  const usedSlotNumbers = slots
    .filter(
      s =>
        String(editing?.buildingId || form.buildingId) &&
        (String(s.buildingId) === String(editing?.buildingId || form.buildingId) ||
          String(s.building?.id) === String(editing?.buildingId || form.buildingId))
    )
    .map(s => s.slotNumber);

  // All slot number options S1-S30
  const slotNumberOptions = [];
  for (let i = 1; i <= 30; i++) {
    const slotNum = "S" + i;
    // If we're editing, allow the current slot to be selectable
    const taken =
      usedSlotNumbers.includes(slotNum) &&
      (!editing || editing.slotNumber !== slotNum);
    slotNumberOptions.push(
      <option key={slotNum} value={slotNum} disabled={taken}>
        {slotNum} {taken ? " (Taken)" : ""}
      </option>
    );
  }

  // ---- Handlers ----
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "buildingId" ? { slotNumber: "" } : {}), // reset slot number when building changes
    }));
  };

  const handleRadioChange = (status) => {
    if (status === "available") {
      setForm(f => ({ ...f, isAvailable: true, isOccupied: false }));
    } else {
      setForm(f => ({ ...f, isAvailable: false, isOccupied: true }));
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({
      buildingId: "",
      slotNumber: "",
      slotType: "",
      location: "",
      isAvailable: true,
      isOccupied: false,
    });
    setShowForm(true);
    setError("");
  };

  const handleEdit = (slot) => {
    setEditing(slot);
    setForm({
      buildingId: slot.building?.id || slot.buildingId || "",
      slotNumber: slot.slotNumber,
      slotType: slot.slotType,
      location: slot.location || "",
      isAvailable: slot.isAvailable,
      isOccupied: slot.isOccupied,
    });
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.buildingId || !form.slotNumber || !form.slotType) {
      setError("Building, Slot Number, and Slot Type are required.");
      return;
    }
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_SLOTS}/${editing.id}` : API_SLOTS;
      const payload = {
        buildingId: Number(form.buildingId),
        slotNumber: form.slotNumber,
        slotType: form.slotType,
        location: form.location,
        isAvailable: form.isAvailable,
        isOccupied: form.isOccupied,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Request failed");
        return;
      }
      setShowForm(false);
      setForm({
        buildingId: "",
        slotNumber: "",
        slotType: "",
        location: "",
        isAvailable: true,
        isOccupied: false,
      });
      refreshSlots();
    } catch (e) {
      setError("Error: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    await fetch(`${API_SLOTS}/${id}`, { method: "DELETE" });
    refreshSlots();
  };

  // ---- Styles ----
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
    background: "linear-gradient(120deg,rgba(44,47,62,0.93),rgba(55,64,105,0.91))",
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

  // -- Filtering slots for table display (by selected building) --
  const displayedSlots = selectedBuildingId
    ? slots.filter(slot =>
        String(slot.buildingId) === String(selectedBuildingId) ||
        String(slot.building?.id) === String(selectedBuildingId)
      )
    : slots;

  return (
    <div style={{ width: "100%", padding: "0 36px", boxSizing: "border-box" }}>
      <h2 style={{
        color: "#fff",
        marginTop: 0,
        fontSize: "2.1rem",
        fontWeight: 800,
        marginBottom: 18
      }}>Slots</h2>

      {/* Building selector for 3D view */}
      <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 16 }}>
        <select
          style={{
            ...inputStyle,
            width: 300,
            margin: 0,
            fontWeight: 500
          }}
          value={selectedBuildingId}
          onChange={e => setSelectedBuildingId(e.target.value)}
        >
          <option value="">Select building for 3D view...</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <button style={{
          ...actionBtn,
          borderRadius: 10,
          fontSize: 16.5,
          margin: 0
        }} onClick={handleAdd}>Add Slot</button>
      </div>

      {/* 3D Parking View */}
      {selectedBuildingId && (
        <Parking3DView
          slots={slots.filter(slot =>
            String(slot.buildingId) === String(selectedBuildingId) ||
            String(slot.building?.id) === String(selectedBuildingId)
          )}
          building={buildings.find(b => String(b.id) === String(selectedBuildingId))}
        />
      )}

      {/* Table view (filtered if building is selected, or all) */}
      <div style={{
        width: "92%",
        minWidth: 650,
        maxWidth: 1200,
        margin: "24px auto 0 auto",
        background: "#23242a",
        borderRadius: 16,
        overflowX: "auto",
        boxShadow: "0 4px 28px #0005"
      }}>
        <table style={{
          width: "100%",
          color: "#fff",
          borderRadius: 12,
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: 15.2,
          tableLayout: "auto"
        }}>
          <thead>
            <tr>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>ID</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Building</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Slot Number</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Type</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Floor</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Location</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Available</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Occupied</th>
              <th style={{ padding: "13px 20px", fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSlots.map(slot => (
              <tr key={slot.id}>
                <td style={{ padding: "11px 20px" }}>{slot.id}</td>
                <td style={{ padding: "11px 20px" }}>
                  {slot.building?.name ||
                    buildings.find(b => b.id === slot.buildingId)?.name ||
                    slot.buildingId}
                </td>
                <td style={{ padding: "11px 20px" }}>{slot.slotNumber}</td>
                <td style={{ padding: "11px 20px" }}>{slot.slotType}</td>
                <td style={{ padding: "11px 20px" }}>{slot.floor}</td>
                <td style={{ padding: "11px 20px" }}>{slot.location}</td>
                <td style={{ padding: "11px 20px" }}>
                  {slot.isAvailable ? <span style={{ color: "limegreen" }}>✔️</span> : <span style={{ color: "#fa5252" }}>❌</span>}
                </td>
                <td style={{ padding: "11px 20px" }}>
                  {slot.isOccupied ? <span style={{ color: "limegreen" }}>✔️</span> : <span style={{ color: "#fa5252" }}>❌</span>}
                </td>
                <td style={{
                  padding: "11px 20px",
                  display: "flex", gap: 7
                }}>
                  <button style={actionBtn} onClick={() => handleEdit(slot)}>Edit</button>
                  <button style={deleteBtn} onClick={() => handleDelete(slot.id)}>Delete</button>
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
        }}>
          <form onSubmit={handleSubmit} style={formStyle}>
            <h3 style={{ color: "#fff", marginBottom: 13, fontWeight: 800 }}>
              {editing ? "Edit Slot" : "Add Slot"}
            </h3>
            <select
              style={inputStyle}
              name="buildingId"
              value={form.buildingId}
              onChange={handleChange}
              required
            >
              <option value="">Select Building</option>
              {buildings.map((b) =>
                <option value={b.id} key={b.id}>{b.name}</option>
              )}
            </select>
            <select
              style={inputStyle}
              name="slotNumber"
              value={form.slotNumber}
              onChange={handleChange}
              required
              disabled={!form.buildingId}
            >
              <option value="">Select Slot Number</option>
              {slotNumberOptions}
            </select>
            <select
              style={inputStyle}
              name="slotType"
              value={form.slotType}
              onChange={handleChange}
              required
            >
              <option value="">Slot Type</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <input
              style={inputStyle}
              name="location"
              placeholder="Location (optional)"
              value={form.location}
              onChange={handleChange}
            />
            <div style={{ display: "flex", gap: 24, margin: "0 0 12px 0" }}>
              <label style={{ color: "#eaf0ff", fontWeight: 500 }}>
                <input
                  type="radio"
                  name="slotStatus"
                  value="available"
                  checked={form.isAvailable && !form.isOccupied}
                  onChange={() => handleRadioChange("available")}
                  style={{ marginRight: 7 }}
                />
                Available
              </label>
              <label style={{ color: "#eaf0ff", fontWeight: 500 }}>
                <input
                  type="radio"
                  name="slotStatus"
                  value="occupied"
                  checked={form.isOccupied && !form.isAvailable}
                  onChange={() => handleRadioChange("occupied")}
                  style={{ marginRight: 7 }}
                />
                Occupied
              </label>
            </div>
            {error && <div style={{ color: "#fa5252", marginBottom: 8, maxWidth: 300 }}>{error}</div>}
            <div style={{ display: "flex", gap: 13, marginTop: 8 }}>
              <button style={actionBtn} type="submit">{editing ? "Update" : "Add"}</button>
              <button style={deleteBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
