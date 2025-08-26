import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ username: false, password: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Regex rules
  const USER_RE = useMemo(() => /^[A-Za-z][A-Za-z0-9._-]{2,19}$/, []);
  const PASS_RE = useMemo(() => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, []);

  const usernameError =
    !username
      ? 'Username is required.'
      : !USER_RE.test(username.trim())
      ? '3–20 chars; start with a letter; letters/numbers/._- only.'
      : '';

  const passwordError =
    !password
      ? 'Password is required.'
      : !PASS_RE.test(password)
      ? 'At least 8 chars, with at least one letter and one number.'
      : '';

  const formValid = !usernameError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setError('');
    if (!formValid) return;

    try {
      const { data } = await login({ username: username.trim(), password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)' }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ minWidth: 370, borderRadius: 18, background: 'linear-gradient(120deg, #26273a 90%, #344a7b 100%)' }}
      >
        <h2 className="fw-bold text-center mb-3 text-light">Login</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-light">Username</label>
            <input
              className={`form-control ${touched.username && usernameError ? 'is-invalid' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              required
              autoFocus
              autoComplete="username"
              aria-invalid={!!(touched.username && usernameError)}
            />
            {touched.username && usernameError && <div className="invalid-feedback">{usernameError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className={`form-control ${touched.password && passwordError ? 'is-invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              required
              autoComplete="current-password"
              aria-invalid={!!(touched.password && passwordError)}
            />
            {touched.password && passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          <button className="btn btn-primary w-100 fw-bold mb-2" type="submit" disabled={!formValid}>
            Login
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-light">Don’t have an account? </span>
          <Link to="/register" className="fw-bold text-info text-decoration-none">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
