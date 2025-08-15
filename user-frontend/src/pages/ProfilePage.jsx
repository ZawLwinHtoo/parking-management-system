// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function ProfilePage() {
  const [user, setUser] = useState(null);       // backend user payload
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [file, setFile] = useState(null);       // selected image file
  const [preview, setPreview] = useState(null); // UI preview
  const [saving, setSaving] = useState(false);

  const userId = useMemo(
    () => JSON.parse(localStorage.getItem('user') || '{}')?.id,
    []
  );

  // helper: base64 -> data URL
  const toDataUrl = (b64) => (b64 ? `data:image/*;base64,${b64}` : null);

  useEffect(() => {
    if (!userId) return;
    axios
      .get('/api/profile', { params: { userId } })
      .then(({ data }) => {
        setUser(data);
        setForm({
          fullName: data?.fullName || '',
          phone: data?.phone || '',
        });
        // show persisted image if present
        setPreview(toDataUrl(data?.profileImage));
      })
      .catch((err) => {
        console.error('Load profile failed', err);
        alert('Load profile failed');
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
    setPreview(URL.createObjectURL(f)); // local preview
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const fd = new FormData();
    fd.append('fullName', form.fullName);
    fd.append('phone', form.phone);
    if (file) fd.append('file', file);

    try {
      setSaving(true);
      // ⛔️ DO NOT set Content-Type header. Let axios set the boundary.
      const { data } = await axios.post('/api/profile/update', fd, {
        params: { userId },
      });

      // update UI with new values
      setUser(data);
      setForm({ fullName: data?.fullName || '', phone: data?.phone || '' });
      setFile(null);
      setPreview(toDataUrl(data?.profileImage)); // reflect DB image

      // keep localStorage user in sync (so topbar initials/name stay updated)
      const old = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...old,
          fullName: data?.fullName,
          phone: data?.phone,
        })
      );

      alert('Profile updated successfully');
    } catch (err) {
      console.error('Save failed', err);
      alert(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const roleText = user?.role ?? '';

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: '280px',
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)',
          paddingTop: 20,
        }}
      >
        <div className="container py-5">
          <h2 className="mb-4 text-light" style={{ textShadow: '0 2px 10px #0005' }}>
            Profile
          </h2>

          <div
            className="card shadow-lg border-0 rounded-4"
            style={{ background: 'linear-gradient(120deg, #26273a 80%, #344a7b 100%)' }}
          >
            <div className="card-body">
              {/* Photo uploader */}
              <div className="d-flex flex-column align-items-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center border"
                  style={{
                    width: 120,
                    height: 120,
                    background: '#3b3f54',
                    backgroundImage: preview ? `url(${preview})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,.35)',
                  }}
                  aria-label="Profile picture"
                >
                  {!preview && '📷'}
                </div>
                <div className="mt-3 w-100" style={{ maxWidth: 420 }}>
                  <Form.Control type="file" accept="image/*" onChange={onFileChange} />
                  <small className="text-secondary d-block mt-2">
                    JPG/PNG recommended. Image is stored in DB and persists after refresh.
                  </small>
                </div>
              </div>

              {/* Details form */}
              <Form onSubmit={onSubmit}>
                {/* Username (read-only) */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="bg-dark text-light"
                  />
                </Form.Group>

                {/* Full Name (editable) */}
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

                {/* Email (read-only) */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.email || ''}
                    disabled
                    className="bg-dark text-light"
                  />
                </Form.Group>

                {/* Phone (editable) */}
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

                {/* Role (read-only) */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Role</Form.Label>
                  <Form.Control type="text" value={roleText} disabled className="bg-dark text-light" />
                </Form.Group>

                <Button type="submit" disabled={saving} className="w-100 btn-primary">
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
