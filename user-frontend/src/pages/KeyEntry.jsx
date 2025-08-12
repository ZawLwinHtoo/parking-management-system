import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Alert, Container, Card } from "react-bootstrap";

export default function KeyEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state || {};
  const userId = prefill.userId;
  const slotId = prefill.slotId;

  const [key, setKey] = useState(prefill.key || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guard: missing state -> bounce back to dashboard
  if (!userId || !slotId) {
    setTimeout(() => navigate("/dashboard"), 1500);
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #25263b 70%, #283148 100%)",
        }}
        className="d-flex align-items-center justify-content-center"
      >
        <Container style={{ maxWidth: 500 }}>
          <Alert variant="danger" className="text-center shadow">
            Missing slot or user info. Redirecting…
          </Alert>
        </Container>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setResult({ success: false, message: "Session expired. Please log in again." });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/parking/verify-key", {
        userId,
        slotId,
        key: key.trim(),
      });
      setResult(res.data);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && result.success) {
      const t = setTimeout(() => navigate("/dashboard"), 1200);
      return () => clearTimeout(t);
    }
  }, [result, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #25263b 70%, #283148 100%)",
      }}
      className="d-flex align-items-center justify-content-center"
    >
      <Container style={{ maxWidth: 520 }}>
        <Card className="shadow-lg border-0 rounded-4" data-bs-theme="dark" style={{ background: "#232633" }}>
          <Card.Body className="p-4">
            <h2 className="text-center text-light fw-bold mb-2" style={{ textShadow: "0 2px 10px #0005" }}>
              Slot Key Validation
            </h2>
            <p className="text-center text-info mb-4">Enter the 4-digit one-time key to unlock.</p>

            <Form onSubmit={handleVerify}>
              <Form.Group className="mb-3">
                <Form.Label className="text-light">One-Time Key</Form.Label>
                <Form.Control
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                  maxLength={4}
                  pattern="\d{4}"
                  placeholder="Enter 4-digit key"
                  autoFocus
                  className="bg-dark text-light"
                />
                <Form.Text className="text-muted">Numbers only • 4 digits</Form.Text>
              </Form.Group>

              <Button
                type="submit"
                disabled={loading || !key}
                className="w-100 mt-1 btn-primary fw-semibold"
              >
                {loading ? "Validating..." : "Unlock"}
              </Button>
            </Form>

            {result && (
              <Alert
                variant={result.success ? "success" : "danger"}
                className="mt-3 text-center mb-0"
                data-bs-theme="dark"
              >
                {result.message}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
