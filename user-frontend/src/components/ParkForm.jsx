  import React, { useState, useEffect } from "react";
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

    // Modal state
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [slotKey, setSlotKey] = useState("");
    const [slotNumber, setSlotNumber] = useState("");
    const [buildingName, setBuildingName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
      getBuildings().then((res) => setBuildings(res.data));
    }, []);

    useEffect(() => {
      if (selectedBuilding) {
        getSlotsByBuilding(selectedBuilding).then((res) => setSlots(res.data));
        setSelectedSlotId(null);
      }
    }, [selectedBuilding]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        const res = await parkCar({
          userId,
          carNumber,
          slotId: selectedSlotId,
        });

        // Extract key, slot info from backend response (ActiveDto)
        const { key, slotNumber, buildingName } = res.data;

        setSlotKey(key);
        setSlotNumber(slotNumber);
        setBuildingName(buildingName);
        setShowKeyModal(true);

        // Do NOT reset state here! Wait until after navigation.
        // (We reset after handling Enter/Close in modal)
      } catch (err) {
        setError(err.response?.data?.message || "Park failed");
      }
    };

    // 🔥 Add floor property before passing to 3D
    const slotsWithFloor = slots.map(slot => ({
      ...slot,
      floor: slot.floor ?? 1
    }));

    // This function snapshots values before resetting
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
        console.log('NAVIGATING with', tempUserId, tempSlotId, tempKey);
        navigate("/key-entry", {
          state: {
            userId: tempUserId,
            slotId: tempSlotId,
            key: tempKey,
          },
        });
      }, 0);
    }

    return (
      <>
        <Form onSubmit={handleSubmit} className="mb-3 bg-dark p-4 rounded shadow-lg" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Select Building</Form.Label>
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
              <Form.Label className="text-light">Choose Slot (3D view)</Form.Label>
              <Parking3DSelector
                slots={slotsWithFloor}
                buildingName={buildings.find(b => b.id === Number(selectedBuilding))?.name}
                selectedSlotId={selectedSlotId}
                onSelectSlot={setSelectedSlotId}
              />
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="text-light">Car Number</Form.Label>
            <Form.Control
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              required
              placeholder="e.g. YGN-1234"
              className="bg-dark text-light"
            />
          </Form.Group>

          <Button
            type="submit"
            className="mt-3 w-100 btn-primary"
            disabled={!selectedSlotId || !carNumber || !selectedBuilding}
          >
            Park
          </Button>

          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>

        {/* Modal for Slot Key */}
        {/* Modal for Slot Key */}
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
    <h1 className="mb-2" style={{ letterSpacing: "8px" }}>{slotKey}</h1>
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
    <Button variant="secondary" onClick={() => setShowKeyModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleEnterKey}>
      Enter
    </Button>
  </Modal.Footer>
</Modal>

      </>
    );
  }
