import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {  
        const data = await response.json();
        onLogin(data); // Pass user info to parent  
      } else {
        const err = await response.json();
        setError(err.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        minHeight: "100svh",
        background: "#191a1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <form onSubmit={handleSubmit} style={{
          background: "#23242a",
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 4px 24px #0006",
          display: "flex",
          flexDirection: "column",
          width: 340,
          gap: 12
        }}>

        <h2 style={{ color: "#fff", marginBottom: 20 }}>Admin Login</h2>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
        />
          {error && (
          <div style={{ color: "red", margin: "8px 0" }}>{error}</div>
          )}  
          <button type="submit" style={{
            background: "#3742fa",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            marginTop: 10,
            cursor: "pointer",
            fontSize: 18
          }}
          >Log In
          </button>
      </form>
    </div>
  );
}

const inputStyle = {
  marginBottom: 8,
  padding: 12,
  fontSize: 16,
  borderRadius: 7,
  border: "1px solid #444",
  background: "#1a1b1e",
  color: "#fff",
  outline: "none"
};
