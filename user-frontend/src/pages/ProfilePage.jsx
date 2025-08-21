import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  const userId = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}")?.id, []);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [changed, setChanged] = useState(false);
  const fileInputRef = useRef(null);

  const b64ToDataUrl = (b64) => (b64 ? `data:image/*;base64,${b64}` : null);

  useEffect(() => {
    if (!userId) return;
    axios
      .get("/api/profile", { params: { userId } })
      .then((res) => {
        const u = res.data || {};
        setUser(u);
        setForm({ fullName: u.fullName || "", phone: u.phone || "" });
        setPreview(b64ToDataUrl(u.profileImage));
      })
      .catch((err) => {
        console.error("Load profile failed", err);
        setError("Failed to load profile");
      });
  }, [userId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setChanged(true);
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("Please select an image file.");
    if (f.size > 2 * 1024 * 1024) return setError("Image is too large. Max 2 MB.");

    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setChanged(true);
  };

  const resetForm = () => {
    if (!user) return;
    setForm({ fullName: user.fullName || "", phone: user.phone || "" });
    setPreview(b64ToDataUrl(user.profileImage));
    setFile(null);
    setChanged(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const fd = new FormData();
    if (file) fd.append("file", file);
    fd.append("fullName", form.fullName);
    fd.append("phone", form.phone);

    try {
      setSaving(true);
      setError("");

      const { data } = await axios.post("/api/profile/update", fd, { params: { userId } });

      setUser(data);
      setForm({ fullName: data.fullName || "", phone: data.phone || "" });
      setPreview(b64ToDataUrl(data.profileImage));
      setFile(null);
      setChanged(false);

      window.dispatchEvent(new CustomEvent("profile-updated", { detail: { userId } }));
    } catch (err) {
      console.error("Save failed", err);
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main className="page-main">
        <div className="container-fluid page-container py-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 className="fw-bold text-light m-0" style={{ textShadow: "0 2px 10px #0005" }}>
                Profile
              </h1>
              <div className="text-info">Manage your account details & photo</div>
            </div>
          </div>

          <Card className="shadow-lg border-0 rounded-4 overflow-hidden"
                style={{ background: "rgba(38,39,58,0.9)", backdropFilter: "blur(6px)" }}
                data-bs-theme="dark">
            <div className="px-4 py-3"
                 style={{
                   background: "linear-gradient(120deg, rgba(38,39,58,1) 60%, rgba(52,74,123,0.85) 100%)",
                   borderBottom: "1px solid rgba(255,255,255,0.08)",
                 }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="text-light fw-semibold">Account Information</div>
                {saving && (
                  <span className="text-secondary small d-flex align-items-center gap-2">
                    <Spinner size="sm" animation="border" /> Saving…
                  </span>
                )}
              </div>
            </div>

            <Card.Body className="p-4">
              <Form onSubmit={onSubmit}>
                <Row className="g-4">
                  <Col xs={12} md={4}>
                    <div className="d-flex flex-column align-items-center text-center">
                      <div
                        className="rounded-circle border border-2 border-secondary mb-3"
                        style={{
                          width: 144,
                          height: 144,
                          background: "#30344a",
                          backgroundImage: preview ? `url(${preview})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                        }}
                        aria-label="Profile picture"
                      />
                      <div className="d-flex gap-2">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} hidden />
                        <Button variant="outline-light" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Change Photo
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={resetForm} disabled={!changed}>
                          Reset
                        </Button>
                      </div>
                      <div className="text-secondary small mt-2">JPG/PNG, max 2&nbsp;MB. Square images look best.</div>
                    </div>
                  </Col>

                  <Col xs={12} md={8}>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="text-light">Username</Form.Label>
                          <Form.Control type="text" value={user?.username || ""} disabled className="bg-dark text-light" />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="text-light">Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={onChange}
                            required
                            className="bg-dark text-light"
                            placeholder="Your full name"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="text-light">Email</Form.Label>
                          <Form.Control type="text" value={user?.email || ""} disabled className="bg-dark text-light" />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="text-light">Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            required
                            className="bg-dark text-light"
                            placeholder="e.g. 09-xxxxxxx"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="text-light">Role</Form.Label>
                          <Form.Control type="text" value={user?.role || ""} disabled className="bg-dark text-light" />
                        </Form.Group>
                      </Col>
                    </Row>

                    {error && <div className="text-danger mt-3">{error}</div>}

                    <div className="d-flex gap-2 mt-4">
                      <Button type="submit" disabled={saving} className="btn-primary">
                        {saving ? (<><Spinner size="sm" animation="border" className="me-2" />Saving…</>) : ("Save Changes")}
                      </Button>
                      <Button type="button" variant="outline-secondary" onClick={resetForm} disabled={!changed || saving}>
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </main>
    </div>
  );
}
