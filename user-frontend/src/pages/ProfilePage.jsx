import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  const userId = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}")?.id, []);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [changed, setChanged] = useState(false);

  const fileInputRef = useRef(null);

  const b64ToDataUrl = (b64) => (b64 ? `data:image/*;base64,${b64}` : null);

  // EXACTLY: 09 + 9 digits = 11 total
  const phoneRegex = /^09\d{9}$/;

  // Load profile
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
      .catch(() => setError("Failed to load profile"));
  }, [userId]);

  // Handlers
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // keep digits only, hard-cap to 11
      const digits = value.replace(/\D/g, "").slice(0, 11);
      setForm((p) => ({ ...p, phone: digits }));
      setChanged(true);
      // live error UX (optional)
      if (digits && !phoneRegex.test(digits)) {
        setError("Phone must start with 09 and be 11 digits.");
      } else {
        setError("");
      }
      return;
    }

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

    // Validate phone before submit
    if (!phoneRegex.test(form.phone)) {
      setError("Phone must start with 09 and be 11 digits (e.g., 09691950162).");
      return;
    }

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

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1600);

      window.dispatchEvent(new CustomEvent("profile-updated", { detail: { userId } }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Derived/fallbacks
  const initials =
    (user?.fullName || user?.username || "U")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main className="page-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={pageBgStyle}>
          <div style={bgAccentStyle} />
          <div style={containerStyle}>
            <h1 style={titleStyle}>Edit Profile</h1>

            {/* Avatar */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={avatarWrapperStyle}>
                {preview ? (
                  <img src={preview} alt="Profile" style={avatarImgStyle} />
                ) : (
                  <span style={avatarInitialsStyle}>{initials}</span>
                )}
              </div>

              <div style={{ marginTop: 10, marginBottom: 8 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} style={browseBtnStyle}>
                  Browse…
                </button>
                {file && <span style={{ color: "#aaa", fontSize: 13, marginLeft: 7 }}>{file.name}</span>}
              </div>
              <div className="text-secondary small" style={{ color: "#9aa3b2", fontSize: 12 }}>
                JPG/PNG, max 2&nbsp;MB. Square images look best.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Labeled value={user?.username || ""} label="Username" readOnly />
              <TextInput name="fullName" value={form.fullName} onChange={onChange} label="Full Name" placeholder="Your full name" />
              <Labeled value={user?.email || ""} label="Email" readOnly />

              <TextInput
                name="phone"
                value={form.phone}
                onChange={onChange}
                label="Phone"
                placeholder="09691950162"
                pattern="^09\d{9}$"
                inputMode="numeric"
                maxLength={11}
                title="Must start with 09 and be 11 digits (e.g., 09691950162)"
                required
              />

              <Labeled value={user?.role || ""} label="Role" readOnly />

              {error && <div style={{ color: "#ff6b6b", marginTop: 4, textAlign: "center" }}>{error}</div>}
              {success && <div style={{ color: "lime", marginTop: 4, textAlign: "center" }}>Profile updated!</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="submit" style={{ ...submitBtnStyle, opacity: saving ? 0.8 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" onClick={resetForm} disabled={!changed || saving} style={secondaryBtnStyle}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

// Small reusable pieces (admin-style)
function TextInput({ label, ...props }) {
  return (
    <div>
      <b style={{ fontWeight: 500 }}>{label}</b>
      <input {...props} style={inputStyle} autoComplete="off" />
    </div>
  );
}

function Labeled({ label, value, readOnly }) {
  return (
    <div>
      <b style={{ fontWeight: 500 }}>{label}</b>
      <input value={value} readOnly={readOnly} style={{ ...inputStyle, opacity: 0.8 }} />
    </div>
  );
}

/* Styles (unchanged) */
const inputStyle = {
  width: "100%",
  marginTop: 7,
  padding: "10px 12px",
  fontSize: 16,
  borderRadius: 8,
  border: "1.4px solid #4b8bfd77",
  background: "#23293f",
  color: "#fff",
  outline: "none",
};

const pageBgStyle = {
  width: "100%",
  minHeight: "calc(100vh - 48px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#181a21",
  position: "relative",
  borderRadius: 16,
};

const bgAccentStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 750,
  height: 420,
  background: "radial-gradient(circle at 40% 60%, #4b8bfd40 0%, #23293f00 100%)",
  filter: "blur(64px)",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

const containerStyle = {
  position: "relative",
  zIndex: 1,
  width: 460,
  margin: "40px auto",
  padding: "38px",
  borderRadius: 20,
  background: "#191d27",
  color: "#fff",
  boxShadow: "0 10px 42px #000a",
};

const titleStyle = {
  fontWeight: 800,
  fontSize: 32,
  marginBottom: 22,
  letterSpacing: 0.2,
  textAlign: "center",
};

const avatarWrapperStyle = {
  width: 110,
  height: 110,
  margin: "0 auto",
  borderRadius: "50%",
  background: "#e6e7ea",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  border: "4px solid #4b8bfd",
  boxShadow: "0 2px 10px #0002",
};

const avatarImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
};

const avatarInitialsStyle = {
  fontSize: 36,
  color: "#2d2e3c",
  fontWeight: 800,
  letterSpacing: 1,
};

const browseBtnStyle = {
  fontSize: 15,
  background: "#eceefe",
  color: "#2d2e3c",
  border: "none",
  padding: "6px 14px",
  borderRadius: 8,
  fontWeight: 600,
  marginRight: 7,
  cursor: "pointer",
};

const submitBtnStyle = {
  background: "#4b8bfd",
  color: "#fff",
  fontWeight: 700,
  border: "none",
  borderRadius: 10,
  padding: "13px 0",
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 2px 8px #4b8bfd44",
  transition: "background 0.18s",
  flex: "0 0 auto",
  width: "50%",
};

const secondaryBtnStyle = {
  background: "transparent",
  color: "#cbd5e1",
  fontWeight: 600,
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "13px 0",
  fontSize: 16,
  cursor: "pointer",
  flex: "0 0 auto",
  width: "50%",
};
