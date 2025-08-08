import React, { useMemo, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { paymentCheckout, getActiveById } from "../api/parking";

export default function UnparkTable({ activeList, onUnpark }) {
  const [selected, setSelected] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [keyModal, setKeyModal] = useState({ show: false, code: null, expiresAt: null });
  const [feeLoading, setFeeLoading] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return activeList || [];
    return (activeList || []).filter(
      (x) =>
        String(x.carNumber || "").toLowerCase().includes(t) ||
        String(x.slotNumber || "").toLowerCase().includes(t)
    );
  }, [q, activeList]);

  const handleUnparkClick = async (car) => {
    setPayError("");
    setFeeLoading(true);
    try {
      const res = await getActiveById(car.parkedId);
      setSelected(res.data);
      setShowPayModal(true);
    } catch (err) {
      setSelected({ ...car, fee: null });
      setPayError("Could not load latest info");
      setShowPayModal(true);
    }
    setFeeLoading(false);
  };

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
      onUnpark();
    } catch (err) {
      setPayError(err?.response?.data?.message || "Payment failed");
    }
    setIsPaying(false);
  };

  const handleCloseKeyModal = () => {
    setKeyModal({ show: false, code: null, expiresAt: null });
    setSelected(null);
    onUnpark();
  };

  if (!activeList || activeList.length === 0) {
    return <div className="alert alert-info text-center mb-0">No cars currently parked.</div>;
  }

  return (
    <>
      {/* small toolbar */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Form className="w-100" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            size="sm"
            placeholder="Filter by car number or slot…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-dark text-light"
          />
        </Form>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered table-sm align-middle mb-0">
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>Car Number</th>
              <th>Slot</th>
              <th style={{ minWidth: 160 }}>Entry Time</th>
              <th style={{ width: 110 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.parkedId}>
                <td>{item.carNumber}</td>
                <td>{item.slotNumber}</td>
                <td>{new Date(item.entryTime).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => handleUnparkClick(item)}
                  >
                    Unpark
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No matches.
                </td>
              </tr>
            )}
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
            <div className="mb-2">
              <div><b>Car Number:</b> {selected.carNumber}</div>
              <div><b>Slot:</b> {selected.slotNumber}</div>
              <div><b>Entry Time:</b> {new Date(selected.entryTime).toLocaleString()}</div>
              <div>
                <b>Fee:</b>{" "}
                {feeLoading
                  ? "Loading..."
                  : selected.fee !== undefined && selected.fee !== null
                    ? `${selected.fee} MMK`
                    : "Calculated at exit"}
              </div>
            </div>
          )}
          <Button
            variant="primary"
            onClick={handlePayNow}
            disabled={isPaying || feeLoading}
            className="w-100"
          >
            {isPaying ? "Processing..." : "Pay Now"}
          </Button>
          {payError && <div className="text-danger text-center mt-2">{payError}</div>}
        </Modal.Body>
      </Modal>

      {/* One-Time Key Modal */}
      <Modal
  show={keyModal.show}
  onHide={handleCloseKeyModal}
  centered
  contentClassName="bg-dark text-light rounded-4 shadow-lg border-0"
>
  <Modal.Header
    closeButton
    className="border-0"
    style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}
  >
    <Modal.Title className="text-info fw-bold">
      Barrier Unlock Code
    </Modal.Title>
  </Modal.Header>

  <Modal.Body className="text-center">
    <h1 className="display-4 fw-bold text-primary" style={{ letterSpacing: "8px" }}>
      {keyModal.code}
    </h1>
    <div className="my-3 text-warning fw-bold">
      This key is valid for 5 minutes only!
    </div>
    <p className="mb-0 text-secondary">
      Enter this code at the barrier to exit the parking.
    </p>
  </Modal.Body>

  <Modal.Footer className="border-0">
    <Button variant="secondary" onClick={handleCloseKeyModal} className="px-4">
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
}
