import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  const userId = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}")?.id,
    []
  );

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const b64ToDataUrl = (b64) => (b64 ? `data:image/*;base64,${b64}` : null);

  useEffect(() => {
    if (!userId) return;
    axios
      .get("/api/profile", { params: { userId } })
      .then((res) => {
        const u = res.data || {};
        setUser(u);
        setForm({ fullName: u.fullName || "", phone: u.phone || "" });
        setPreview(b64ToDataUrl(u.profileImage)); // persisted photo
      })
      .catch((err) => {
        console.error("Load profile failed", err);
        // optional: alert('Failed to load profile');
      });
  }, [userId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
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
      const { data } = await axios.post("/api/profile/update", fd, {
        params: { userId },
        // DO NOT set Content-Type; axios will set the proper multipart boundary
      });

      setUser(data);
      setForm({ fullName: data.fullName || "", phone: data.phone || "" });
      setPreview(b64ToDataUrl(data.profileImage));
      setFile(null);

      // notify the topbar to refresh the avatar
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: { userId } }));

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Save failed", err);
      alert(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          marginLeft: "280px",
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(120deg, #25263b 70%, #283148 100%)",
          paddingTop: "20px",
        }}
      >
        <div className="container py-5">
          <h2 className="mb-4 text-light">Profile</h2>

          <div
            className="card shadow-lg border-0 rounded-4"
            style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}
          >
            <div className="card-body">
              <div className="d-flex flex-column align-items-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 120,
                    height: 120,
                    background: "#3b3f54",
                    backgroundImage: preview ? `url(${preview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                  }}
                >
                  {!preview && "📷"}
                </div>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="bg-dark text-light"
                />
              </div>

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.username || ""}
                    disabled
                    className="bg-dark text-light"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={onChange}
                    required
                    className="bg-dark text-light"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.email || ""}
                    disabled
                    className="bg-dark text-light"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    required
                    className="bg-dark text-light"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Role</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.role || ""}
                    disabled
                    className="bg-dark text-light"
                  />
                </Form.Group>

                <Button type="submit" disabled={saving} className="w-100 btn-primary">
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
