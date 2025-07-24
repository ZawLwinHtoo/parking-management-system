import React, { useState, useEffect } from "react";
import { getBuildings, getSlotsByBuilding, parkCar } from "../api/parking";
import { Button, Form } from "react-bootstrap";
import Parking3DSelector from "./Parking3DSelector";

export default function ParkForm({ userId, onSuccess }) {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [carNumber, setCarNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getBuildings().then((res) => setBuildings(res.data));
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      getSlotsByBuilding(selectedBuilding)
        .then((res) => setSlots(res.data));
      setSelectedSlotId(null);
    }
  }, [selectedBuilding]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await parkCar({
        userId,
        carNumber,
        slotId: selectedSlotId,
      });
      setCarNumber("");
      setSelectedSlotId(null);
      setSelectedBuilding("");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Park failed");
    }
  };

  // 🔥 Add floor property before passing to 3D
  const slotsWithFloor = slots.map(slot => ({
    ...slot,
    floor: Number(slot.slotNumber.match(/F(\d+)/)?.[1] || 1)
  }));

  return (
    <Form onSubmit={handleSubmit} className="mb-3 bg-secondary p-4 rounded shadow">
      <Form.Group className="mb-3">
        <Form.Label>Select Building</Form.Label>
        <Form.Select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          required
        >
          <option value="">-- Choose Building --</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedBuilding && (
        <>
          <Form.Label>Choose Slot (3D view)</Form.Label>
          <Parking3DSelector
            slots={slotsWithFloor}
            buildingName={buildings.find(b => b.id === Number(selectedBuilding))?.name}
            selectedSlotId={selectedSlotId}
            onSelectSlot={setSelectedSlotId}
          />
        </>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Car Number</Form.Label>
        <Form.Control
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          required
          placeholder="e.g. YGN-1234"
        />
      </Form.Group>

      <Button
        type="submit"
        className="mt-2"
        disabled={!selectedSlotId || !carNumber || !selectedBuilding}
      >
        Park
      </Button>
      {error && <p className="text-danger mt-2">{error}</p>}
    </Form>
  );
}
