import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Alert, Container } from "react-bootstrap";

export default function KeyEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state || {};
  const userId = prefill.userId;
  const slotId = prefill.slotId;

  const [key, setKey] = useState(prefill.key || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user or slot is missing
  if (!userId || !slotId) {
    setTimeout(() => navigate("/dashboard"), 2000);
    return (
      <Container style={{ maxWidth: 450 }}>
        <Alert variant="danger" className="mt-4 text-center">
          Missing slot or user info. Redirecting...
        </Alert>
      </Container>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    const token = localStorage.getItem("token");  // Check for the token

    if (!token) {
      setResult({
        success: false,
        message: "Session expired. Please log in again.",
      });
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

  // Auto-redirect to dashboard after successful unlock
  React.useEffect(() => {
    if (result && result.success) {
      const timeout = setTimeout(() => {
        navigate("/dashboard"); // Navigate to dashboard after successful key validation
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [result, navigate]);

  return (
    <Container style={{ maxWidth: 450 }}>
      <h2 className="my-4 text-center text-light">Slot Key Validation</h2>
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
            className="bg-dark text-light"  // Dark background with light text
          />
        </Form.Group>
        <Button
          type="submit"
          disabled={loading || !key}
          className="w-100 mt-3 btn-primary"  // Use primary color for the button
        >
          {loading ? "Validating..." : "Unlock"}
        </Button>
      </Form>

      {result && (
        <Alert
          variant={result.success ? "success" : "danger"}
          className="mt-3 text-center"
        >
          {result.message}
        </Alert>
      )}
    </Container>
  );
}
