import React, { useState, useEffect } from "react";
import { getBuildings, getSlotsByBuilding, parkCar } from "../api/parking";
import { Button, Form, Row, Col } from "react-bootstrap";

export default function ParkForm({ userId, onSuccess }) {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [carNumber, setCarNumber] = useState("");
  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    getBuildings().then((res) => setBuildings(res.data));
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      setLoadingSlots(true);
      getSlotsByBuilding(selectedBuilding)
        .then((res) => setSlots(res.data))
        .finally(() => setLoadingSlots(false));
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
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedBuilding && (
        <>
          <Form.Label>Choose Slot</Form.Label>
          <Row className="mb-3">
            {loadingSlots && <div className="text-info">Loading slots...</div>}
            {slots.map((slot) => (
              <Col xs={3} sm={2} md={2} lg={1} key={slot.id} className="mb-2">
                <Button
                  variant={
                    slot.isOccupied
                      ? "danger"
                      : selectedSlotId === slot.id
                      ? "primary"
                      : "success"
                  }
                  disabled={slot.isOccupied}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className="w-100"
                  style={{ minWidth: 60, fontWeight: 600 }}
                >
                  {slot.slotNumber}
                </Button>
              </Col>
            ))}
            {slots.length === 0 && !loadingSlots && (
              <Col>
                <span className="text-warning">No slots found for this building.</span>
              </Col>
            )}
          </Row>
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
