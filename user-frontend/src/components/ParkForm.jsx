import React, { useState, useEffect, useMemo } from "react";
import { getBuildings, getSlotsByBuilding, parkCar, cancelPark } from "../api/parking";
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

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [slotKey, setSlotKey] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [parkedId, setParkedId] = useState(null);

  const navigate = useNavigate();
  const PLATE_RE = useMemo(() => /^(?:[A-Z]{2}-\d{4}|[1-9][A-Z]-\d{4})$/, []);

  useEffect(() => { getBuildings().then(res => setBuildings(res.data)); }, []);
  useEffect(() => {
    if (selectedBuilding) {
      getSlotsByBuilding(selectedBuilding).then(res => setSlots(res.data));
      setSelectedSlotId(null);
    }
  }, [selectedBuilding]);

  const onCarInput = (e) => {
    const normalized = (e.target.value || "").toUpperCase().replace(/\s+/g, "");
    setCarNumber(normalized);
    if (!normalized) setPlateError("");
    else if (!PLATE_RE.test(normalized)) setPlateError("Enter a correct plate (AA-1234 or 1A-1234).");
    else setPlateError("");
  };

  // Robust extractor: JSON, ProblemDetail, plain text, Blob
  const extractErrorMessage = async (err) => {
    const res = err?.response;
    if (!res) return "Network error. Please try again.";

    let data = res.data;
    try {
      if (data instanceof Blob) {
        const text = await data.text();
        try { data = JSON.parse(text); } catch { data = text; }
      }
    } catch { /* noop */ }

    const msg =
      (typeof data === "string" && data) ||
      data?.detail ||
      data?.message ||
      data?.error ||
      data?.title ||
      null;

    if (msg) {
      // normalize a couple of known cases
      if (/duplicated car number/i.test(msg) || /already parked/i.test(msg)) {
        return "Duplicated Car Number";
      }
      if (/occupied/i.test(msg)) return "Selected slot is already occupied!";
      if (/invalid car number/i.test(msg)) return "Invalid car number format. Use formats like 1A-1234 or AA-1234";
      return msg;
    }

    // Smart fallback for 409 when body had no message
    if (res.status === 409) {
      // If we *know* locally that the slot shows occupied, prefer that message
      const slot = slots.find(s => String(s.id) === String(selectedSlotId));
      if (slot?.isOccupied) return "Selected slot is already occupied!";
      // Otherwise give a helpful combined hint
      return "Duplicated Car Number or the slot was taken just now. Please refresh and try again.";
    }

    if (res.status === 400) return "Invalid input. Check your car number and try again.";
    if (res.status === 404) return "Selected slot could not be found. Please refresh the page.";
    return res.statusText || "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!PLATE_RE.test((carNumber || "").toUpperCase())) {
      setPlateError("Enter a correct plate (AA-1234 or 1A-1234).");
      return;
    }

    try {
      const res = await parkCar({
        userId,
        carNumber: carNumber.toUpperCase(),
        slotId: selectedSlotId,
      });
      const { parkedId: pid, key, slotNumber, buildingName } = res.data;
      setParkedId(pid);
      setSlotKey(key);
      setSlotNumber(slotNumber);
      setBuildingName(buildingName);
      setShowKeyModal(true);
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  const handleCancelPark = async () => {
    try {
      if (parkedId) await cancelPark({ parkedId, userId });
      setError("Parking was cancelled before code verification. Your slot has been released.");
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setShowKeyModal(false);
      setCarNumber("");
      setSelectedSlotId(null);
      setSelectedBuilding("");
      setParkedId(null);
      onSuccess && onSuccess();
    }
  };

  const handleEnterKey = () => {
    const tempUserId   = userId;
    const tempSlotId   = selectedSlotId;
    const tempKey      = slotKey;
    const tempParkedId = parkedId;

    setShowKeyModal(false);
    setCarNumber("");
    setSelectedSlotId(null);
    setSelectedBuilding("");
    onSuccess && onSuccess();

    navigate("/key-entry", {
      state: { userId: tempUserId, slotId: tempSlotId, key: tempKey, parkedId: tempParkedId },
    });
  };

  const slotsWithFloor = slots.map((slot) => ({ ...slot, floor: slot.floor ?? 1 }));
  const selectedBuildingObj = useMemo(
    () => buildings.find((b) => b.id === Number(selectedBuilding)),
    [buildings, selectedBuilding]
  );
  const selectedSlot = useMemo(
    () => slots.find((s) => String(s.id) === String(selectedSlotId)),
    [slots, selectedSlotId]
  );

  const submitDisabled =
    !selectedSlotId || !selectedBuilding || !carNumber || !!plateError || !PLATE_RE.test(carNumber);

  return (
    <>
      <Form onSubmit={handleSubmit} className="mb-3 bg-dark p-4 rounded shadow-lg" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Select Building</Form.Label>
          <Form.Select value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)} required>
            <option value="">-- Choose Building --</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
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

            {selectedSlot && (
              <div className="d-flex align-items-center mt-3 px-3 py-2 rounded-3"
                   style={{ background: "linear-gradient(120deg, rgba(52,74,123,.25), rgba(38,39,58,.65))", border: "1px solid rgba(255,255,255,.1)" }}>
                <div className="me-3">
                  <span className="badge bg-primary me-2">Selected</span>
                  <strong className="text-light">{selectedSlot.slotNumber}</strong>
                </div>
                <div className="text-secondary small">
                  {selectedBuildingObj?.name || "Building"} • Floor {selectedSlot.floor}
                  {selectedSlot.slotType ? ` • ${selectedSlot.slotType}` : ""}
                </div>
                <Button variant="outline-light" size="sm" className="ms-auto" onClick={() => setSelectedSlotId(null)}>Change</Button>
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
        </Form.Group>
        {plateError && <div className="invalid-feedback d-block">{plateError}</div>}

        <Button type="submit" className="mt-3 w-100 btn-primary" disabled={submitDisabled}>
          {selectedSlot ? `Park in ${selectedSlot.slotNumber}` : "Park"}
        </Button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </Form>

      <Modal
        show={showKeyModal}
        onHide={handleCancelPark}
        centered
        backdrop="static"
        keyboard={false}
        data-bs-theme="dark"
        contentClassName="bg-dark text-light border-0 rounded-4"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Slot Entry Key</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h1 className="mb-2" style={{ letterSpacing: "8px" }}>{slotKey}</h1>
          <div className="my-2">
            <b>Slot:</b> {slotNumber} <br />
            <b>Building:</b> {buildingName}
          </div>
          <div className="my-2 text-warning"><b>This key is valid for 5 minutes only!</b></div>
          <div>Enter this code at the barrier to confirm your parking spot.</div>
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-between">
          <Button variant="outline-light" onClick={handleCancelPark}>Cancel</Button>
          <Button variant="primary" onClick={handleEnterKey}>Enter</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
