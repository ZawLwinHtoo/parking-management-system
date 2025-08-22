import React, { useState, useEffect, useMemo } from "react";
import { getBuildings, getSlotsByBuilding, parkCar } from "../api/parking";
import { Button, Form, Modal } from "react-bootstrap";
import Parking3DSelector from "./Parking3DSelector";
import { useNavigate } from "react-router-dom";

export default function ParkForm({ userId, onSuccess }) {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [carNumber, setCarNumber] = useState("");
  const [error, setError] = useState("");
  const [plateError, setPlateError] = useState("");

  // Modal state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [slotKey, setSlotKey] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const navigate = useNavigate();

  // Updated regex to support both "AA-1234" and "1A-1234"
  const PLATE_RE = useMemo(() => /^[A-Z]{1}[A-Z]-\d{4}$|^[1-9]{1}[A-Z]{1}-\d{4}$/, []);

  useEffect(() => {
    getBuildings().then((res) => setBuildings(res.data));
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      getSlotsByBuilding(selectedBuilding).then((res) => setSlots(res.data));
      setSelectedSlotId(null); // reset selection when building changes
    }
  }, [selectedBuilding]);

  const onCarInput = (e) => {
    const raw = e.target.value || "";
    const normalized = raw.toUpperCase().replace(/\s+/g, "");
    setCarNumber(normalized);

    if (!normalized) setPlateError("");
    else if (!PLATE_RE.test(normalized)) setPlateError("Enter correct car number (e.g., AA-1234 or 1A-1234)");
    else setPlateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!PLATE_RE.test(carNumber)) {
      setPlateError("Enter correct car number (e.g., AA-1234 or 1A-1234)");
      return;
    }

    try {
      const res = await parkCar({
        userId,
        carNumber: carNumber.toUpperCase(),
        slotId: selectedSlotId,
      });

      const { key, slotNumber, buildingName } = res.data;
      setSlotKey(key);
      setSlotNumber(slotNumber);
      setBuildingName(buildingName);
      setShowKeyModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Park failed");
    }
  };

  // Ensure floor exists
  const slotsWithFloor = slots.map((slot) => ({ ...slot, floor: slot.floor ?? 1 }));

  // Convenience lookups for the info chip
  const selectedBuildingObj = useMemo(
    () => buildings.find((b) => b.id === Number(selectedBuilding)),
    [buildings, selectedBuilding]
  );

  // Use selectedSlotId to get the selected slot
  const selectedSlot = useMemo(
    () => slots.find((s) => String(s.id) === String(selectedSlotId)),
    [slots, selectedSlotId]
  );

  function handleEnterKey() {
    const tempUserId = userId;
    const tempSlotId = selectedSlotId;
    const tempKey = slotKey;

    setShowKeyModal(false);
    setCarNumber("");
    setSelectedSlotId(null);
    setSelectedBuilding("");
    onSuccess && onSuccess();

    setTimeout(() => {
      navigate("/key-entry", {
        state: { userId: tempUserId, slotId: tempSlotId, key: tempKey },
      });
    }, 0);
  }

  const submitDisabled =
    !selectedSlotId ||
    !selectedBuilding ||
    !carNumber ||
    !!plateError ||
    !PLATE_RE.test(carNumber);

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        className="mb-3 bg-dark p-4 rounded shadow-lg"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Select Building</Form.Label>
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
            <Form.Label className="text-light">Choose Slot (3D view)</Form.Label>
            <Parking3DSelector
              slots={slotsWithFloor}
              buildingName={selectedBuildingObj?.name}
              selectedSlotId={selectedSlotId}
              onSelectSlot={(id) => setSelectedSlotId(Number(id))}
            />

            {/* ✅ Persistent selected slot chip */}
            {selectedSlot && (
              <div
                className="d-flex align-items-center mt-3 px-3 py-2 rounded-3"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(52,74,123,.25), rgba(38,39,58,.65))",
                  border: "1px solid rgba(255,255,255,.1)",
                }}
              >
                <div className="me-3">
                  <span className="badge bg-primary me-2">Selected</span>
                  <strong className="text-light">{selectedSlot.slotNumber}</strong>
                </div>
                <div className="text-secondary small">
                  {selectedBuildingObj?.name || "Building"} • Floor {selectedSlot.floor}
                  {selectedSlot.slotType ? ` • ${selectedSlot.slotType}` : ""}
                </div>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-auto"
                  onClick={() => setSelectedSlotId(null)}
                >
                  Change
                </Button>
              </div>
            )}
          </>
        )}

        <Form.Group className="mb-3 mt-3">
          <Form.Label className="text-light">Car Number</Form.Label>
          <Form.Control
            value={carNumber}
            onChange={onCarInput}
            placeholder="e.g. AA-1234 or 1A-1234"
            className={`bg-dark text-light ${plateError ? "is-invalid" : ""}`}
          />
          {plateError && <div className="invalid-feedback">{plateError}</div>}
        </Form.Group>

        <Button
          type="submit"
          className="mt-3 w-100 btn-primary"
          disabled={submitDisabled}
        >
          {selectedSlot ? `Park in ${selectedSlot.slotNumber}` : "Park"}
        </Button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </Form>

      <Modal
        show={showKeyModal}
        onHide={() => setShowKeyModal(false)}
        centered
        data-bs-theme="dark"
        contentClassName="bg-dark text-light border-0 rounded-4"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Slot Entry Key</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h1 className="mb-2" style={{ letterSpacing: "8px" }}>
            {slotKey}
          </h1>
          <div className="my-2">
            <b>Slot:</b> {slotNumber} <br />
            <b>Building:</b> {buildingName}
          </div>
          <div className="my-2 text-warning">
            <b>This key is valid for 5 minutes only!</b>
          </div>
          <div>Enter this code at the barrier to confirm your parking spot.</div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="primary" onClick={handleEnterKey}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
