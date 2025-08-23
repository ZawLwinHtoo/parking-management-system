import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// -- SlotBox: One parking slot in 3D --
function SlotBox({ slot, x, y, z, onHover, onClick, isSelected, hideHtml }) {
  const meshRef = useRef();
  let color = slot.isOccupied ? "#ffe066" : "#51cf66";
  const scale = isSelected ? 1.13 : 1.0;
  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      scale={scale}
      onPointerOver={e => { e.stopPropagation(); onHover(slot, e); }}
      onPointerOut={e => { e.stopPropagation(); onHover(null, e); }}
      onClick={e => { e.stopPropagation(); onClick(slot); }}
      castShadow
    >
      <boxGeometry args={[0.8, 0.3, 0.8]} />
      <meshStandardMaterial color={color} opacity={isSelected ? 0.95 : 1} />
      {/* Slot Number Label */}
      {!hideHtml && (
        <Html distanceFactor={10} position={[0, 0.26, 0]} center>
          <div style={{
            fontSize: 15, color: "#fff", fontWeight: 900, textShadow: "0 2px 8px #0008",
            background: "#23293fee", padding: "2px 10px", borderRadius: 8, userSelect: "none",
            letterSpacing: ".03em"
          }}>
            {slot.slotNumber}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// -- Beautiful, Centered Tooltip --
function SlotTooltip({ slot, onClose }) {
  if (!slot) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 29 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -57%)",
          zIndex: 9000,
          background: "#212a3af1",
          color: "#fff",
          borderRadius: 14,
          padding: "20px 32px 16px 32px",
          fontSize: 15.5,
          fontWeight: 800,
          boxShadow: "0 8px 32px #001c",
          border: "2px solid #60dafb",
          textAlign: "center",
          minWidth: 160,
          maxWidth: 320,
          pointerEvents: "auto",
          userSelect: "none",
          backdropFilter: "blur(4px)",
          letterSpacing: ".01em",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 6, right: 10, zIndex: 2,
            background: "transparent", color: "#60dafb",
            border: "none", fontSize: 22, cursor: "pointer",
            fontWeight: 700, padding: 0, opacity: 0.74,
          }}
        >×</button>
        <div style={{
          fontSize: 22,
          fontWeight: 900,
          marginBottom: 1,
          color: "#60dafb",
          letterSpacing: ".01em",
          textShadow: "0 1px 6px #0008"
        }}>
          {slot.slotNumber}
        </div>
        <div style={{ color: "#a5d8ff", marginBottom: 4, fontWeight: 800, fontSize: 14 }}>
          {slot.slotType?.toUpperCase() || ""}
        </div>
        <div>
          <b>Status:</b>{" "}
          {slot.isOccupied ? (
            <span style={{ color: "#ffe066", fontWeight: 900 }}>Occupied</span>
          ) : (
            <span style={{ color: "#51cf66", fontWeight: 900 }}>Free</span>
          )}
        </div>
        {slot.location && (
          <div style={{ fontWeight: 600, marginTop: 6, fontSize: 13 }}>
            <b>Location:</b> {slot.location}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// -- Side Panel for Slot Info --
function SlotSidePanel({ slot, onClose, onEdit, onDelete }) {
  if (!slot) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 390 }}
        animate={{ x: 0 }}
        exit={{ x: 390 }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        style={{
          position: "fixed", top: 0, right: 0, width: 390, height: "100vh", 
        background: "linear-gradient(120deg,#172032 80%,#23293f 100%)",
        // or just a solid color: background: "#172032",    
          boxShadow: "0 0 28px #1971c244",
          zIndex: 6000, color: "#fff", padding: "38px 30px"
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 18, right: 18, zIndex: 10,
            width: 44, height: 44, background: "#23293f",
            color: "#fff", border: "none", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 10px #23293f33", transition: "background .17s", outline: "none"
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#31405e")}
          onMouseOut={e => (e.currentTarget.style.background = "#23293f")}
        >×</button>
        <h2 style={{ margin: "0 0 19px 0", fontSize: 28, fontWeight: 800, color: "#60dafb" }}>
          {slot.slotNumber} <span style={{
            fontWeight: 400, fontSize: 16, color: "#a5d8ff"
          }}>{slot.slotType}</span>
        </h2>
        <div style={{ fontSize: 17, marginBottom: 10 }}>
          <b>Occupied:</b> {slot.isOccupied ? "Yes" : "No"} <br />
          <b>Floor:</b> {slot.floor || "-"} <br />
          <b>Location:</b> {slot.location || "-"}
        </div>
        <div style={{ marginTop: 23, display: "flex", gap: 13 }}>
          <button onClick={() => onEdit(slot)}
            style={{
              background: "linear-gradient(90deg,#4263eb 60%,#3bc9db 120%)", color: "#fff",
              border: "none", borderRadius: 8, padding: "9px 22px", fontWeight: 700, fontSize: 15.5,
              cursor: "pointer", boxShadow: "0 2px 8px #4263eb29"
            }}>Edit</button>
          <button onClick={() => onDelete(slot.id)}
            style={{
              background: "linear-gradient(90deg,#fa5252 65%,#ffb02e 110%)", color: "#fff",
              border: "none", borderRadius: 8, padding: "9px 22px", fontWeight: 700, fontSize: 15.5,
              cursor: "pointer", boxShadow: "0 2px 8px #fa525226"
            }}>Delete</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main 3D Parking View ---
export default function Parking3DView({
  slots = [],
  buildingName = "Building",
  onEditSlot,
  onDeleteSlot,
  hideHtml = false,
}) {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Group slots by floor
  const floors = [[], [], []];
  slots.forEach(slot => {
    const floor = slot.floor || Math.ceil(parseInt(slot.slotNumber.replace(/[^\d]/g, "")) / 10);
    if (floor >= 1 && floor <= 3) floors[floor - 1].push({ ...slot, floor });
  });
  // Sort by slot number
  floors.forEach(arr =>
    arr.sort((a, b) => parseInt(a.slotNumber.replace(/[^\d]/g, "")) - parseInt(b.slotNumber.replace(/[^\d]/g, "")))
  );

  function handleSlotHover(slot, event) {
    setHoveredSlot(slot);
  }

  return (
    <div
      style={{
        height: 520, width: "100%",
        background: "#161921",
        borderRadius: 15,
        boxShadow: "0 4px 48px #0007",
        marginBottom: 26,
        position: "relative",
        overflow: "visible"
      }}>
      <Canvas camera={{ position: [6, 7, 13], fov: 38 }}>
        {/* LIGHTS */}
        <ambientLight intensity={0.68} />
        <directionalLight position={[7, 13, 11]} intensity={0.7} />
        <OrbitControls enablePan enableZoom maxPolarAngle={Math.PI / 2.1} />

        {/* BUILDING LABEL */}
        {!hideHtml && (
          <Html position={[0, 3.8, 0]} center>
            <div style={{
              fontWeight: 900, fontSize: 22, color: "#60dafb",
              letterSpacing: ".03em", background: "#23293fd0",
              padding: "4px 22px", borderRadius: 15, marginBottom: 8,
              border: "2px solid #2e9cca"
            }}>
              {buildingName}
            </div>
          </Html>
        )}

        {/* FLOORS & SLOTS */}
        {floors.map((slotsOnFloor, floorIdx) => (
          <group key={floorIdx} position={[0, floorIdx * 1.2, 0]}>
            {/* Floor platform */}
            <mesh>
              <boxGeometry args={[10, 0.18, 3.3]} />
              <meshStandardMaterial color="#3b4252" opacity={0.91} transparent />
            </mesh>
            {/* Slots */}
            {slotsOnFloor.map((slot, i) => (
              <SlotBox
                key={slot.id}
                slot={slot}
                x={-4.2 + (i % 10) * 0.92}
                y={0.24}
                z={0}
                isSelected={selectedSlot?.id === slot.id}
                onHover={handleSlotHover}
                onClick={setSelectedSlot}
                hideHtml={hideHtml}   // <-- ADD THIS LINE!
              />
            ))}
            {/* Floor label */}
            {!hideHtml && (
              <Html position={[-5, 0.38, 0]} center>
                <div style={{
                  color: "#a5d8ff",
                  fontSize: 18,
                  fontWeight: 700,
                  background: "#232930c9",
                  borderRadius: 9,
                  padding: "3px 14px",
                  letterSpacing: ".05em"
                }}>
                  Floor {floorIdx + 1}
                </div>
              </Html>
            )}
          </group>
        ))}
      </Canvas>

      {/* Tooltip, always on top & centered */}
      {(selectedSlot || hoveredSlot) && (
        <SlotTooltip
          slot={selectedSlot || hoveredSlot}
          onClose={() => setSelectedSlot(null)}
        />
      )}

      {/* Side Panel */}
      <SlotSidePanel
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onEdit={onEditSlot}
        onDelete={onDeleteSlot}
      />
    </div>
  );
}
