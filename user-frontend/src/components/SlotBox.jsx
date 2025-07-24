function SlotBox({ x, y, z, slot, selected, onClick }) {
  let color = slot.occupied
    ? "#fa5252"   // Red for occupied/unavailable
    : selected
      ? "#339af0" // Blue for selected
      : "#51cf66";// Green for available

  return (
    <mesh
      position={[x, y, z]}
      onClick={() => !slot.occupied && onClick(slot.id)}
      onPointerOver={e => {
        if (!slot.occupied) document.body.style.cursor = "pointer";
      }}
      onPointerOut={e => {
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={[0.8, 0.3, 0.8]} />
      <meshStandardMaterial color={color} opacity={selected ? 1 : 0.9} />
      {/* ...rest, like highlight etc */}
    </mesh>
  );
}
