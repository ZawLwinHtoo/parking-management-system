import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

function SlotBox({ x, y, z, slot, selected, onClick }) {
  let color = slot.isOccupied
    ? "#fa5252"     // Red for occupied
    : selected
      ? "#339af0"   // Blue for selected
      : "#51cf66";  // Green for available

  return (
    <mesh
      position={[x, y, z]}
      onClick={() => !slot.isOccupied && onClick(slot.id)}
      onPointerOver={e => {
        if (!slot.isOccupied) document.body.style.cursor = "pointer";
      }}
      onPointerOut={e => {
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={[0.8, 0.3, 0.8]} />
      <meshStandardMaterial color={color} opacity={selected ? 1 : 0.9} />
      {selected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.32, 0.85]} />
          <meshStandardMaterial color="#228be6" transparent opacity={0.25} />
        </mesh>
      )}
      {/* Slot name label removed */}
    </mesh>
  );
}

export default function Parking3DSelector({
  slots = [],
  buildingName = "Building",
  selectedSlotId,
  onSelectSlot
}) {
  console.log("SLOTS DEBUG:", slots);
  const floors = [[], [], []]; // 3 floors
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
      let ai = parseInt(a.slotNumber.replace(/[^\d]/g, ''));
      let bi = parseInt(b.slotNumber.replace(/[^\d]/g, ''));
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
      marginBottom: 26
    }}>
      <Canvas camera={{ position: [6, 7, 13], fov: 38 }}>
        <ambientLight intensity={0.68} />
        <directionalLight position={[7, 13, 11]} intensity={0.7} />
        <OrbitControls enablePan enableZoom maxPolarAngle={Math.PI / 2.1} />
        {/* Building label */}
        <Html position={[0, 3.8, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{
            fontWeight: 900, fontSize: 21, color: "#93e2ff",
            letterSpacing: ".03em", background: "#23293fd0",
            padding: "4px 22px", borderRadius: 15, marginBottom: 8
          }}>
            {buildingName}
          </div>
        </Html>
        {floors.map((slotsOnFloor, floorIdx) => (
          <group key={floorIdx} position={[0, floorIdx * 1.2, 0]}>
            <mesh>
              <boxGeometry args={[10, 0.18, 3.3]} />
              <meshStandardMaterial color="#49536e" opacity={0.81} transparent />
            </mesh>
            {slotsOnFloor.map((slot, i) => (
              <SlotBox
                key={slot.id}
                x={-4.2 + (i % 10) * 0.92}
                y={0.24}
                z={0}
                slot={slot}
                selected={selectedSlotId === slot.id}
                onClick={onSelectSlot}
              />
            ))}
            <Html position={[-5, 0.38, 0]} center style={{ pointerEvents: "none" }}>
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
          </group>
        ))}
      </Canvas>
    </div>
  );
}
