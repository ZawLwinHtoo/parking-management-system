import React from "react";
import { Spinner } from "react-bootstrap";

/** Full-screen overlay loader */
export function PageLoader({ show, text = "Loading…" }) {
  if (!show) return null;
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="loader-card">
        <Spinner animation="border" variant="light" />
        <div className="mt-3 text-light fw-semibold">{text}</div>
      </div>
    </div>
  );
}

/** Section (in-card) loader */
export function SectionLoader({ text = "Loading…" }) {
  return (
    <div className="section-loader">
      <Spinner animation="border" variant="light" />
      <span className="ms-2 text-light-50">{text}</span>
    </div>
  );
}
