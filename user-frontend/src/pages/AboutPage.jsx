import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AboutPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      {/* Use the global page layout class to avoid the white gap */}
      <main className="page-main">
        <div className="container-fluid page-container py-5">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div className="text-center text-md-start">
              <h1 className="fw-bold text-light m-0" style={{ textShadow: "0 2px 10px #0005" }}>
                About SPARK
              </h1>
            </div>
            <span className="badge bg-secondary fs-6 px-3 py-2">Version 1.0.0</span>
          </div>

          {/* Intro */}
          <div className="card shadow-lg border-0 rounded-4 mb-4" 
               style={{
                 background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)", 
                 borderRadius: '16px', 
                 overflow: 'hidden', // Added to clip any overflow
                 boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)" // Optional, to ensure the card has a smooth shadow
               }}>
            <div className="card-body">
              <p className="text-light mb-0">
                SPARK streamlines how drivers find, reserve, and manage parking. From real-time slot
                selection and one-time entry codes to transparent fee calculation and downloadable
                receipts, SPARK is designed to be fast, reliable, and secure.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* About Us */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 h-100" 
                   style={{
                     background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)", 
                     borderRadius: '16px', 
                     overflow: 'hidden', 
                     boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)"
                   }}>
                <div className="card-body">
                  <h4 className="text-light fw-bold mb-3">About Us</h4>
                  <ul className="text-secondary m-0 ps-3" style={{ lineHeight: 1.8 }}>
                    <li>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia maxime
                      blanditiis animi cupiditate velit, voluptates enim eaque magni neque? Nihil
                      dolores explicabo non nesciunt molestiae dolorem nostrum voluptatum illum
                      consectetur?
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 h-100" 
                   style={{
                     background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)", 
                     borderRadius: '16px', 
                     overflow: 'hidden', 
                     boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)"
                   }}>
                <div className="card-body">
                  <h4 className="text-light fw-bold mb-3">How It Works</h4>
                  <ul className="text-secondary m-0 ps-3" style={{ lineHeight: 1.8 }}>
                    <li>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, excepturi
                      corrupti quae fugiat fuga quam voluptatibus rem, possimus est similique
                      perferendis distinctio iusto hic aliquam expedita porro tempore sapiente
                      quidem!
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 h-100" 
                   style={{
                     background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)", 
                     borderRadius: '16px', 
                     overflow: 'hidden', 
                     boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)"
                   }}>
                <div className="card-body">
                  <h4 className="text-light fw-bold mb-3">Technology</h4>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-secondary">React</span>
                    <span className="badge bg-secondary">React Router</span>
                    <span className="badge bg-secondary">Bootstrap</span>
                    <span className="badge bg-secondary">Spring Boot</span>
                    <span className="badge bg-secondary">JPA / Hibernate</span>
                    <span className="badge bg-secondary">MySQL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support/Contact */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 h-100" 
                   style={{
                     background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)", 
                     borderRadius: '16px', 
                     overflow: 'hidden', 
                     boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)"
                   }}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h4 className="text-light fw-bold mb-2">Support</h4>
                    <p className="text-secondary mb-0">
                      Have a question or feature request? Reach out through the contact form.
                    </p>
                  </div>
                  <div className="mt-3">
                    <Link to="/contact" className="btn btn-outline-light">
                      Go to Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-secondary small mt-4">
            © {new Date().getFullYear()} SPARK. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}
