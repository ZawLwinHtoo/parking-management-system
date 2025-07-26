function SlotBox({ x, y, z, slot, selected, onClick }) {
  let color = slot.occupied ? "#fa5252" : (selected ? "#339af0" : "#51cf66");

  return (
    <mesh
      position={[x, y, z]}
      onClick={() => (!slot.occupied) && onClick(slot.id)}
      onPointerOver={e => {
        if (!slot.occupied) document.body.style.cursor = "pointer";
      }}
      onPointerOut={e => {
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={[0.8, 0.3, 0.8]} />
      <meshStandardMaterial color={color} opacity={selected ? 1 : 0.9} />
      {/* Highlight for selected */}
      {selected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.32, 0.85]} />
          <meshStandardMaterial color="#228be6" transparent opacity={0.22} />
        </mesh>
      )}
    </mesh>
  );
}
