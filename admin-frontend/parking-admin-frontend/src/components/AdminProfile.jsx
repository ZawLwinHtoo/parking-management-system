import React, { useEffect, useRef, useState } from "react";

export default function AdminProfile() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    profileImage: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState("");
  const inputFileRef = useRef();

  // Load user data on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({
        username: user.username || "",
        fullName: user.fullName || user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        profileImage: user.profileImage || user.profile_image || "",
      });
      fetch(`/api/users/${user.id}`)
        .then((res) => res.json())
        .then((data) =>
          setForm((f) => ({
            ...f,
            username: data.username || "",
            fullName: data.fullName || data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "",
            profileImage: data.profileImage || data.profile_image || "",
          }))
        );
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle image file select
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  // Upload profile image
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/users/${user.id}/upload-profile-image`, {
      method: "POST",
      body: fd,
    });
    const imgUrl = await res.text();
    setUploading(false);
    setForm((f) => ({
      ...f,
      profileImage: imgUrl.replace(/^"|"$/g, ""),
    }));
    const updatedUser = { ...user, profileImage: imgUrl.replace(/^"|"$/g, "") };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setFile(null);
    setPreview("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1800);
  };

  // Edit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);
      const newUser = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  // Avatar source logic
  const profileImageUrl =
    form.profileImage && form.profileImage.startsWith("/api/")
      ? form.profileImage
      : form.profileImage || "";

  // Fallback initials
  const initials =
    (form.fullName || form.username || "A")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div style={pageBgStyle}>
      {/* Gradient/blur accent behind card */}
      <div style={bgAccentStyle} />
      <div style={containerStyle}>
        <h1 style={titleStyle}>Edit Profile</h1>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={avatarWrapperStyle}>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={avatarImgStyle}
              />
            ) : profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                style={avatarImgStyle}
              />
            ) : (
              <span style={avatarInitialsStyle}>{initials}</span>
            )}
          </div>
          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={inputFileRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => inputFileRef.current.click()}
              style={browseBtnStyle}
            >
              Browse...
            </button>
            {file && (
              <span style={{ color: "#aaa", fontSize: 13, marginLeft: 7 }}>
                {file.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                ...uploadBtnStyle,
                cursor: file && !uploading ? "pointer" : "not-allowed",
                opacity: file && !uploading ? 1 : 0.7,
              }}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <FormInput label="Username" name="username" value={form.username} onChange={handleChange} />
          <FormInput label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <FormInput label="Email" name="email" value={form.email} onChange={handleChange} />
          <FormInput label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <FormInput label="Role" name="role" value={form.role} readOnly />
          <button
            type="submit"
            style={submitBtnStyle}
          >
            Save Changes
          </button>
        </form>
        {success && (
          <div style={{ color: "lime", marginTop: 13, textAlign: "center" }}>
            Profile updated!
          </div>
        )}
      </div>
    </div>
  );
}

// --- Reusable Input Component ---
function FormInput({ label, ...props }) {
  return (
    <div>
      <b style={{ fontWeight: 500 }}>{label}</b>
      <input {...props} style={inputStyle} autoComplete="off" />
    </div>
  );
}

// --- Styles ---
const pageBgStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#181a21",
  position: "relative",
  zIndex: 0,
};

const bgAccentStyle = {
  position: "fixed",
  left: "50%",
  top: "50%",
  width: 750,
  height: 420,
  background: "radial-gradient(circle at 40% 60%, #4b8bfd40 0%, #23293f00 100%)",
  filter: "blur(64px)",
  zIndex: 1,
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

const containerStyle = {
  position: "relative",
  zIndex: 2,
  width: 440,
  margin: "70px auto",
  padding: "38px 38px 30px 38px",
  borderRadius: 20,
  background: "#191d27",
  color: "#fff",
  boxShadow: "0 10px 42px #000a",
  minHeight: 540,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const titleStyle = {
  fontWeight: 800,
  fontSize: 32,
  marginBottom: 26,
  letterSpacing: 0.1,
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
  position: "relative",
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
};

const uploadBtnStyle = {
  fontSize: 15,
  background: "#4287f5",
  color: "#fff",
  border: "none",
  padding: "6px 18px",
  borderRadius: 8,
  fontWeight: 700,
  marginLeft: 8,
  transition: "0.2s",
};

const submitBtnStyle = {
  background: "#4b8bfd",
  color: "#fff",
  fontWeight: 700,
  border: "none",
  borderRadius: 10,
  padding: "13px 0",
  marginTop: 16,
  fontSize: 19,
  cursor: "pointer",
  boxShadow: "0 2px 8px #4b8bfd44",
  transition: "background 0.18s",
};

const inputStyle = {
  width: "100%",
  margin: "7px 0 0 0",
  padding: "10px 12px",
  fontSize: 17,
  borderRadius: 8,
  border: "1.4px solid #4b8bfd77",
  background: "#23293f",
  color: "#fff",
  outline: "none",
  marginBottom: 0,
};
