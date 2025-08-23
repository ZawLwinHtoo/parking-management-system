import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Parking3DView from "./Parking3DView";
import toast, { Toaster } from "react-hot-toast";

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
    isOccupied: false,
  });
  const [error, setError] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const firstInputRef = useRef(null);

  useEffect(() => {
    fetch(API_BUILDINGS)
      .then(res => res.json())
      .then(setBuildings)
      .catch(() => setBuildings([]));
  }, []);
  useEffect(() => { refreshSlots(); }, []);
  const refreshSlots = () => {
    fetch(API_SLOTS)
      .then(res => res.json())
      .then(setSlots)
      .catch(() => setSlots([]));
  };
  useEffect(() => {
    if (showForm && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showForm]);
  useEffect(() => {
    if (!showForm) return;
    const onKey = (e) => { if (e.key === "Escape") setShowForm(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showForm]);

  const handleAdd = () => {
    setEditing(null);
    setForm({
      buildingId: "",
      slotNumber: "",
      slotType: "",
      location: "",
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
      isOccupied: slot.isOccupied,
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    await fetch(`${API_SLOTS}/${id}`, { method: "DELETE" });
    refreshSlots();
    toast.success("Slot deleted!");
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
        isOccupied: false,
      });
      refreshSlots();
      toast.success(editing ? "Slot updated!" : "Slot added!");
    } catch (e) {
      setError("Error: " + e.message);
    }
  };

  const displayedSlots = selectedBuildingId
    ? slots.filter(slot =>
        String(slot.buildingId) === String(selectedBuildingId) ||
        String(slot.building?.id) === String(selectedBuildingId)
      )
    : slots;

  const usedSlotNumbers = slots
    .filter(
      s =>
        String(editing?.buildingId || form.buildingId) &&
        (String(s.buildingId) === String(editing?.buildingId || form.buildingId) ||
          String(s.building?.id) === String(editing?.buildingId || form.buildingId))
    )
    .map(s => s.slotNumber);

  const slotNumberOptions = [];
  for (let i = 1; i <= 30; i++) {
    const slotNum = "S" + i;
    const taken =
      usedSlotNumbers.includes(slotNum) &&
      (!editing || editing.slotNumber !== slotNum);
    slotNumberOptions.push(
      <option key={slotNum} value={slotNum} disabled={taken}>
        {slotNum} {taken ? " (Taken)" : ""}
      </option>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "buildingId" ? { slotNumber: "" } : {}),
    }));
  };

  // Only toggle isOccupied, no isAvailable
  const handleRadioChange = (status) => {
    setForm(f => ({ ...f, isOccupied: status === "occupied" }));
  };

  const getFloor = (slot) =>
    slot.floor ||
    Math.ceil(parseInt(slot.slotNumber.replace("S", "")) / 10);

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
    alignItems: "center",
    position: "relative"
  };

  // --- MODAL JSX, PORTALED TO BODY ---
  const modal = (
    <div style={{
      position: "fixed",
      left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(34,41,72,0.82)",
      backdropFilter: "blur(7px)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={formStyle}
        onKeyDown={e => {
          if (e.key === "Escape") setShowForm(false);
        }}
      >
        <h3 style={{
          color: editing ? "#61dafb" : "#51cf66",
          marginBottom: 13,
          fontWeight: 800,
          fontSize: 23,
          letterSpacing: ".03em"
        }}>
          {editing ? "Edit Slot" : "Add Slot"}
        </h3>
        <select
          ref={firstInputRef}
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
              checked={!form.isOccupied}
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
              checked={form.isOccupied}
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
  );

  return (
    <div style={{ width: "100%", padding: "0 36px", boxSizing: "border-box" }}>
      <Toaster position="top-center" />
      <h2 style={{
        color: "#fff",
        marginTop: 0,
        fontSize: "2.1rem",
        fontWeight: 800,
        marginBottom: 18
      }}>Slots</h2>

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

      {selectedBuildingId && (
        <Parking3DView
          slots={displayedSlots}
          buildingName={
            buildings.find(b => String(b.id) === String(selectedBuildingId))?.name || ""
          }
          onEditSlot={handleEdit}
          onDeleteSlot={handleDelete}
          hideHtml={showForm}
        />
      )}

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
                <td style={{ padding: "11px 20px" }}>{getFloor(slot)}</td>
                <td style={{ padding: "11px 20px" }}>{slot.location}</td>
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

      {showForm &&
        ReactDOM.createPortal(modal, document.body)
      }
    </div>
  );
}
