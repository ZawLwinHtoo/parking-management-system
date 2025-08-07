import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { unparkCar, paymentCheckout, getActiveById } from "../api/parking";

export default function UnparkTable({ activeList, onUnpark }) {
  const [selected, setSelected] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [keyModal, setKeyModal] = useState({ show: false, code: null, expiresAt: null });
  const [feeLoading, setFeeLoading] = useState(false);

  // Click "Unpark" -> open Payment modal with FRESH data (with fee)
  const handleUnparkClick = async (car) => {
  setPayError("");
  setFeeLoading(true);
  try {
    const res = await getActiveById(car.parkedId); // Fetch active data
    setSelected(res.data);
    setShowPayModal(true);
  } catch (err) {
    setSelected({ ...car, fee: null });
    setPayError("Could not load latest info");
    setShowPayModal(true);
  }
  setFeeLoading(false);
};


  // Pay Now handler (simulate)
  const handlePayNow = async () => {
    setIsPaying(true);
    setPayError("");
    try {
      const res = await paymentCheckout(selected.parkedId);
      setKeyModal({
        show: true,
        code: res.data.code,
        expiresAt: res.data.expiresAt,
      });
      setShowPayModal(false);
      onUnpark(); // Refresh lists after paying
    } catch (err) {
      setPayError(err?.response?.data?.message || "Payment failed");
    }
    setIsPaying(false);
  };

  // Close key modal, refresh again for safety
  const handleCloseKeyModal = () => {
    setKeyModal({ show: false, code: null, expiresAt: null });
    setSelected(null);
    onUnpark();
  };

  // Safe check for activeList to prevent errors if undefined or empty
  if (!activeList || activeList.length === 0) {
    return <div className="alert alert-info text-center mb-0">No cars currently parked.</div>;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered mb-0">
          <thead>
            <tr>
              <th>Car Number</th>
              <th>Slot</th>
              <th>Entry Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeList.map((item) => (
              <tr key={item.parkedId}>
                <td>{item.carNumber}</td>
                <td>{item.slotNumber}</td>
                <td>{new Date(item.entryTime).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUnparkClick(item)}
                  >
                    Unpark
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Parking Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              <div><b>Car Number:</b> {selected.carNumber}</div>
              <div><b>Slot:</b> {selected.slotNumber}</div>
              <div><b>Entry Time:</b> {new Date(selected.entryTime).toLocaleString()}</div>
              <div>
                <b>Fee:</b>{" "}
                {feeLoading ? "Loading..." : 
                  (selected.fee !== undefined && selected.fee !== null
                    ? `${selected.fee} MMK`
                    : "Calculated at exit")}
              </div>
            </div>
          )}
          <div className="my-3">
            <Button
              variant="primary"
              onClick={handlePayNow}
              disabled={isPaying || feeLoading}
              className="w-100"
            >
              {isPaying ? "Processing..." : "Pay Now"}
            </Button>
          </div>
          {payError && <div className="text-danger text-center">{payError}</div>}
        </Modal.Body>
      </Modal>

      {/* One-Time Key Modal */}
      <Modal show={keyModal.show} onHide={handleCloseKeyModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Barrier Unlock Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h1 style={{ letterSpacing: "8px" }}>{keyModal.code}</h1>
          <div className="my-2 text-warning">
            <b>This key is valid for 5 minutes only!</b>
          </div>
          <div>Enter this code at the barrier to exit the parking.</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseKeyModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
