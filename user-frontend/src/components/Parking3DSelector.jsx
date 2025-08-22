import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

function SlotBox({ x, y, z, slot, selected, onClick, onHover, hovered }) {
  let color =
    slot.isOccupied || slot.occupied === true || slot.isAvailable === false
      ? "#fa5252" // Red if occupied or unavailable
      : selected
        ? "#339af0" // Blue for selected
        : "#51cf66"; // Green for available

  return (
    <mesh
      position={[x, y, z]}
      onClick={() => (!slot.isOccupied && slot.isAvailable !== false) && onClick(slot.id)}
      onPointerOver={e => {
        if (!slot.isOccupied && slot.isAvailable !== false) document.body.style.cursor = "pointer";
        onHover(slot.id);
      }}
      onPointerOut={e => {
        document.body.style.cursor = "default";
        onHover(null);
      }}
    >
      <boxGeometry args={[0.8, 0.3, 0.8]} />
      <meshStandardMaterial color={color} opacity={selected ? 1 : 0.92} />
      {/* Highlight for selected */}
      {selected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.32, 0.85]} />
          <meshStandardMaterial color="#228be6" transparent opacity={0.22} />
        </mesh>
      )}
      {/* Only show label on hover */}
      {hovered && (
        <Html distanceFactor={10} position={[0, 0.28, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{
            fontSize: 15,
            color: "#fff",
            fontWeight: "bold",
            background: "#228be6cc",
            padding: "3px 12px",
            borderRadius: 7,
            userSelect: "none",
            border: "2px solid #fff",
            boxShadow: "0 2px 12px #228be660",
            pointerEvents: "none",
            transition: "background 0.17s"
          }}>
            {slot.slotNumber}
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function Parking3DSelector({
  slots = [],
  buildingName = "Building",
  selectedSlotId,
  onSelectSlot
}) {
  const [hoveredSlotId, setHoveredSlotId] = useState(null);

  // Organize slots by floor
  const floors = [[], [], []];
  slots.forEach(slot => {
    let floor = slot.floor;
    if (!floor && slot.slotNumber) {
      const match = slot.slotNumber.match(/F(\d+)/i);
      if (match) floor = Number(match[1]);
    }
    if (floor >= 1 && floor <= 3) {
      floors[floor - 1].push(slot);
    }
  });
  floors.forEach(arr =>
    arr.sort((a, b) => {
      let ai = parseInt(a.slotNumber.replace(/[^\d]/g, ""));
      let bi = parseInt(b.slotNumber.replace(/[^\d]/g, ""));
      return ai - bi;
    })
  );

  return (
    <div style={{
      height: 420,
      width: "100%",
      background: "#161921",
      borderRadius: 13,
      boxShadow: "0 4px 48px #0007",
      marginBottom: 26,
      position: "relative"
    }}>
      <Canvas camera={{ position: [6, 7, 13], fov: 38 }}>
        <ambientLight intensity={0.68} />
        <directionalLight position={[7, 13, 11]} intensity={0.7} />
        <OrbitControls enablePan enableZoom maxPolarAngle={Math.PI / 2.1} />

        {/* Building label */}
        <Html position={[0, 4.6, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{
            fontWeight: 900, fontSize: 24, color: "#93e2ff",
            letterSpacing: ".03em", background: "#23293fd0",
            padding: "7px 34px", borderRadius: 16, marginBottom: 8,
            border: "2px solid #228be6"
          }}>
            {buildingName}
          </div>
        </Html>

        {/* Floors & slots */}
        {floors.map((slotsOnFloor, floorIdx) => (
          <group key={floorIdx} position={[0, floorIdx * 1.25, 0]}>
            {/* Floor base */}
            <mesh>
              <boxGeometry args={[10, 0.18, 3.3]} />
              <meshStandardMaterial color="#49536e" opacity={0.81} transparent />
            </mesh>
            {/* Slots */}
            {slotsOnFloor.map((slot, i) => (
              <SlotBox
                key={slot.id}
                x={-4.2 + (i % 10) * 0.92}
                y={0.24}
                z={0}
                slot={slot}
                selected={selectedSlotId === slot.id}
                onClick={onSelectSlot}
                onHover={setHoveredSlotId}
                hovered={hoveredSlotId === slot.id}
              />
            ))}
            {/* Floor label */}
            <Html position={[-5, 0.38, 0]} center style={{ pointerEvents: "none" }}>
              <div style={{
                color: "#a5d8ff",
                fontSize: 19,
                fontWeight: 700,
                background: "#232930c9",
                borderRadius: 10,
                padding: "6px 18px",
                letterSpacing: ".04em",
                border: "2px solid #339af0",
                boxShadow: "0 1px 7px #232e4470"
              }}>
                Floor {floorIdx + 1}
              </div>
            </Html>
          </group>
        ))}
      </Canvas>
    </div>
  );
}
