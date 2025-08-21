import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Form, Button, Card, Badge } from "react-bootstrap";
import { createFeedback, getFeedback } from "../api/parking";

export default function ContactPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  const fetchList = () => {
    if (!userId) return;
    getFeedback(userId)
      .then((res) => setList(res.data || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load feedback"));
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [userId]);

  const rows = useMemo(() => {
    return (list || [])
      .map((f) => ({
        id: f.id,
        message: f.message ?? f.content ?? "",
        status: f.status ?? "open",
        createdAt: f.createdAt ?? f.created_at ?? f.submitted_at,
        adminReply: f.adminReply ?? f.admin_reply ?? null,
        userFollowup: f.userReply ?? f.user_followup ?? f.reply ?? null,
      }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [list]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createFeedback({ userId, message: message.trim() });
      setMessage("");
      fetchList();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onLogout={handleLogout} />

      <main className="page-main">
        <div className="container-fluid page-container py-5">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="text-center text-md-start">
              <h1 className="fw-bold text-light mb-1" style={{ textShadow: "0 2px 10px #0005" }}>
                Contact & Feedback
              </h1>
              <p className="lead mb-0 text-info">
                Hi <b>{user.fullName || user.username}</b>, tell us anything—our team will reply here.
              </p>
            </div>
            <div className="badge bg-secondary fs-6 px-3 py-2">
              Tickets: <span className="fw-semibold">{rows.length}</span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <Card className="shadow-lg border-0 rounded-4" data-bs-theme="dark" style={{ background: "#232633" }}>
                <Card.Body className="p-4">
                  <h4 className="text-info fw-bold mb-3">Send a message</h4>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-light">Your Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Describe the issue or share feedback…"
                        className="bg-dark text-light"
                      />
                      <Form.Text className="text-muted">We usually reply within 24 hours.</Form.Text>
                    </Form.Group>

                    <Button type="submit" disabled={submitting || !message.trim()} className="w-100 fw-semibold btn-primary">
                      {submitting ? "Sending…" : "Send"}
                    </Button>

                    {error && <div className="text-danger text-center mt-3">{error}</div>}
                  </Form>
                </Card.Body>
              </Card>
            </div>

            <div className="col-12 col-lg-7">
              <Card className="shadow-lg border-0 rounded-4" style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="mb-0 text-light fw-bold">Your previous messages</h4>
                    <button className="btn btn-outline-light btn-sm" onClick={fetchList}>Refresh</button>
                  </div>

                  {rows.length === 0 ? (
                    <div className="alert alert-info mb-0">No messages yet. Send your first one on the left.</div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {rows.map((f) => (
                        <div key={f.id} className="list-group-item bg-transparent text-light px-0 py-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="me-3">
                              <div className="fw-semibold">{f.message}</div>
                              <small className="text-secondary">
                                Sent: {f.createdAt ? new Date(f.createdAt).toLocaleString() : "-"}
                              </small>
                            </div>
                            <Badge bg={f.status === "open" ? "warning" : "success"} className="text-dark">
                              {f.status || "open"}
                            </Badge>
                          </div>

                          <div className="mt-3 p-3 rounded-3" style={{ background: "#1e2130" }}>
                            <div className="fw-semibold mb-1">Admin reply</div>
                            <div
                              className={f.adminReply ? "text-light" : "text-secondary"}
                              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            >
                              {f.adminReply ? f.adminReply : "No reply yet."}
                            </div>
                          </div>

                          {f.userFollowup && (
                            <div className="mt-2 p-2 rounded-3 border border-secondary">
                              <small className="text-secondary">Your follow-up:</small>
                              <div className="text-light" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                {f.userFollowup}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
