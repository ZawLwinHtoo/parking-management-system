import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    fullName: false,
    email: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Regex rules
  const USER_RE = useMemo(() => /^[A-Za-z][A-Za-z0-9._-]{2,19}$/, []);
  const NAME_RE = useMemo(() => /^[A-Za-z][A-Za-z\s'.-]{1,49}$/, []);
  const EMAIL_RE = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, []);
  const PASS_RE = useMemo(() => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, []);

  const errs = {
    username:
      !form.username
        ? 'Username is required.'
        : !USER_RE.test(form.username.trim())
        ? '3–20 chars; start with a letter; letters/numbers/._- only.'
        : '',
    fullName:
      !form.fullName
        ? 'Full name is required.'
        : !NAME_RE.test(form.fullName.trim())
        ? "2–50 chars; letters, spaces, and .'- allowed."
        : '',
    email:
      !form.email
        ? 'Email is required.'
        : !EMAIL_RE.test(form.email.trim())
        ? 'Enter a valid email address.'
        : '',
    password:
      !form.password
        ? 'Password is required.'
        : !PASS_RE.test(form.password)
        ? 'At least 8 chars, with at least one letter and one number.'
        : '',
  };

  const formValid = !errs.username && !errs.fullName && !errs.email && !errs.password;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true, fullName: true, email: true });
    setError('');
    if (!formValid) return;

    const payload = {
      username: form.username.trim(),
      password: form.password,
      fullName: form.fullName.trim().replace(/\s+/g, ' '),
      email: form.email.trim(),
    };

    try {
      await register(payload);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)' }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ minWidth: 410, borderRadius: 18, background: 'linear-gradient(120deg, #26273a 90%, #344a7b 100%)' }}
      >
        <h2 className="fw-bold text-center mb-3 text-light">Register</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-light">Username</label>
            <input
              name="username"
              className={`form-control ${touched.username && errs.username ? 'is-invalid' : ''}`}
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="username"
              aria-invalid={!!(touched.username && errs.username)}
            />
            {touched.username && errs.username && <div className="invalid-feedback">{errs.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Full Name</label>
            <input
              name="fullName"
              className={`form-control ${touched.fullName && errs.fullName ? 'is-invalid' : ''}`}
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="name"
              aria-invalid={!!(touched.fullName && errs.fullName)}
            />
            {touched.fullName && errs.fullName && <div className="invalid-feedback">{errs.fullName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              name="email"
              type="email"
              className={`form-control ${touched.email && errs.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="email"
              aria-invalid={!!(touched.email && errs.email)}
            />
            {touched.email && errs.email && <div className="invalid-feedback">{errs.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              name="password"
              type="password"
              className={`form-control ${touched.password && errs.password ? 'is-invalid' : ''}`}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="new-password"
              aria-invalid={!!(touched.password && errs.password)}
            />
            {touched.password && errs.password && <div className="invalid-feedback">{errs.password}</div>}
            <div className="form-text text-muted">
              Must be at least 8 characters and include a letter and a number.
            </div>
          </div>

          <button className="btn btn-success w-100 fw-bold mb-2" type="submit" disabled={!formValid}>
            Register
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-light">Already have an account? </span>
          <Link to="/login" className="fw-bold text-info text-decoration-none">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
