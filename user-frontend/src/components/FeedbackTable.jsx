import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

export default function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState([]);

  // Fetch the feedback data (mock data for now)
  useEffect(() => {
    // Mock data for now
    const mockFeedback = [
      {
        id: 1,
        user_id: 101,
        message: "I am having trouble with the parking system.",
        created_at: "2025-08-07 10:00:00",
        submitted_at: "2025-08-07 10:05:00",
        admin_reply: "We're working on it.",
        status: "open",
        reply: "Looking into the issue."
      },
      {
        id: 2,
        user_id: 102,
        message: "The parking space is too crowded.",
        created_at: "2025-08-07 12:00:00",
        submitted_at: "2025-08-07 12:10:00",
        admin_reply: null,
        status: "open",
        reply: null
      },
    ];

    setFeedbackList(mockFeedback);
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Previous Feedback</h1>
      <Table striped bordered hover className="bg-light rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Submitted At</th>
            <th>Admin Reply</th>
            <th>Status</th>
            <th>Reply</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.id}</td>
              <td>{feedback.user_id}</td>
              <td>{feedback.message}</td>
              <td>{feedback.created_at}</td>
              <td>{feedback.submitted_at}</td>
              <td>{feedback.admin_reply || "No reply yet"}</td>
              <td>{feedback.status}</td>
              <td>{feedback.reply || "No reply yet"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
