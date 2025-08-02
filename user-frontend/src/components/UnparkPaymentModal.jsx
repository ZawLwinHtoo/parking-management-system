import React, { useState } from "react";
import { checkoutAndGenerateKey } from "../api/payment";
import { Modal, Button } from "react-bootstrap";

export default function UnparkModal({ show, onHide, active, user }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [key, setKey] = useState(null);
  const [expires, setExpires] = useState(null);
  const [error, setError] = useState("");

  if (!active) return null; // parked car info

  const handlePay = async () => {
    setPaying(true);
    setError("");
    try {
      const res = await checkoutAndGenerateKey(active.parkedId);
      setKey(res.data.key);
      setExpires(res.data.expiresAt);
      setPaid(true);
    } catch (err) {
      setError("Payment failed!");
    }
    setPaying(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout & Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div><b>Car No.:</b> {active.carNumber}</div>
        <div><b>User:</b> {user?.username || "-"}</div>
        <div><b>Entry:</b> {active.entryTime}</div>
        <div><b>Exit:</b> {active.exitTime || new Date().toISOString()}</div>
        <div><b>Fee:</b> {active.fee} MMK</div>
        {paid ? (
          <div className="mt-4 text-center">
            <h4>Your exit key:</h4>
            <div style={{fontSize: "2em", letterSpacing: "8px"}}>{key}</div>
            <div>Valid for 5 min only!</div>
          </div>
        ) : (
          <Button variant="success" onClick={handlePay} disabled={paying}>
            {paying ? "Processing..." : "Pay Now"}
          </Button>
        )}
        {error && <div className="text-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {paid ? "Done" : "Cancel"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
