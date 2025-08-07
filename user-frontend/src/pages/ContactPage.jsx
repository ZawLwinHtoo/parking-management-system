import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar'; // Import Sidebar component

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");  // Store form submission status

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace this with actual API call to submit feedback
    try {
      // Mock API call for now
      console.log("Submitting feedback: ", message);
      setStatus("Feedback submitted successfully!");
      setMessage(""); // Clear form after submission
    } catch (err) {
      setStatus("Failed to submit feedback. Please try again.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect to login page on logout
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar Component */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div
        style={{
          marginLeft: '250px', // Make room for the sidebar
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)',
          paddingTop: '20px', // Optional: Ensure some padding at the top
        }}
      >
        <div className="container py-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold text-light" style={{ textShadow: '0 2px 10px #0005' }}>
              Contact Us
            </h1>
            <p className="lead mb-3 text-info">
              Please let us know your concerns or suggestions. We will get back to you as soon as possible.
            </p>
          </div>

          {/* Feedback Form */}
          <Form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Your Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Enter your message here..."
                className="bg-dark text-light"
              />
            </Form.Group>

            <Button type="submit" className="mt-3 w-100 btn-primary">
              Submit Feedback
            </Button>

            {status && <p className="mt-3 text-center text-success">{status}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
}
