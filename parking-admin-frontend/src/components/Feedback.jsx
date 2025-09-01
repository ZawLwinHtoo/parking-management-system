import React, { useEffect, useState, useMemo } from "react";
import { FaReply, FaCheck, FaTrashAlt } from "react-icons/fa";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// Toast component
function Toast({ message, type = "info", onClose }) {
  if (!message) return null;
  const bg = type === "success" ? "#1abc9c" : type === "error" ? "#e74c3c" : "#4361ee";
  return (
    <div
      style={{
        position: "fixed", bottom: 32, right: 32, background: bg, color: "#fff",
        borderRadius: 12, boxShadow: "0 2px 18px #151d2a80",
        padding: "16px 34px 16px 24px", fontSize: 18, fontWeight: 600,
        zIndex: 1200, animation: "fade-in .22s", cursor: "pointer", letterSpacing: ".01em",
      }}
      onClick={onClose}
    >
      {message}
      <span style={{ marginLeft: 22, fontWeight: 900, fontSize: 22 }} onClick={onClose}>×</span>
      <style>{`@keyframes fade-in {from{opacity:0;transform:translateY(36px);}to{opacity:1;transform:translateY(0);}}`}</style>
    </div>
  );
}

/** Modal for writing a reply */
function ReplyModal({ open, onClose, onSubmit, value, onChange }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(16,24,39,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1100, backdropFilter: "blur(2px)"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(680px, 92vw)",
          background: "#22314f",
          border: "1px solid #3550817a",
          borderRadius: 14,
          boxShadow: "0 14px 44px #0b11233f",
          padding: 22,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 10, fontWeight: 800, color: "#a9c8ff" }}>
          Write a reply
        </h3>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your reply…"
          style={{
            width: "96%",
            minHeight: "160px",
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #415a8f",
            background: "#1b2741",
            color: "#eaf2ff",
            fontSize: "15.5px",
            outline: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "box-shadow 0.3s ease-in-out",
            resize: "vertical",
            maxHeight: "250px", // Limit height of textarea
            overflowY: "auto"
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px",
              padding: "10px 18px", fontWeight: 700, cursor: "pointer", transition: "background-color 0.3s ease",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            style={{
              background: "#0984e3", color: "#fff", border: "none", borderRadius: "8px",
              padding: "10px 18px", fontWeight: 700, cursor: "pointer", transition: "background-color 0.3s ease",
            }}
          >
            Submit Reply
          </button>
        </div>
      </div>
    </div>
  );
}

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [deletingId, setDeletingId] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  // reuse these for modal reply
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ---- fetch table data ----
  const fetchFeedbacks = () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams({
      status: statusFilter === "all" ? "" : statusFilter,
      page: currentPage,
      size: feedbacksPerPage,
      dateFilter
    }).toString();

    fetch(`/api/feedback?${queryParams}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) {
          setFeedbacks(data.content);
          setTotalPages(data.totalPages ?? 1);
          setTotalElements(data.totalElements ?? data.content.length ?? 0);
        } else if (Array.isArray(data)) {
          setFeedbacks(data);
          setTotalPages(1);
          setTotalElements(data.length);
        } else {
          setFeedbacks([]);
          setTotalPages(1);
          setTotalElements(0);
        }
      })
      .catch(() => setError("Failed to fetch feedbacks."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [statusFilter, currentPage, dateFilter]);

  // ---- pie data for this page ----
  const pieData = useMemo(() => {
    const counts = feedbacks.reduce((acc, fb) => {
      const k = (fb.status || "unknown").toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [feedbacks]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3300);
  };

  // ---- actions ----
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Feedback deleted!", "success");
        fetchFeedbacks();
      } else {
        showToast("Failed to delete feedback.", "error");
      }
    } catch {
      showToast("Failed to delete feedback.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}/resolve`, { method: "POST" });
      if (res.ok) {
        showToast("Marked as resolved!", "success");
        fetchFeedbacks();
      } else {
        showToast("Failed to mark as resolved.", "error");
      }
    } catch {
      showToast("Failed to mark as resolved.", "error");
    } finally {
      setResolvingId(null);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      showToast("Reply cannot be empty.", "error");
      return;
    }
    try {
      const res = await fetch(`/api/feedback/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(replyText),
      });
      if (res.ok) {
        showToast("Reply sent!", "success");
        setReplyModalOpen(false);
        setReplyingId(null);
        setReplyText("");
        fetchFeedbacks();
      } else {
        showToast("Failed to reply.", "error");
      }
    } catch {
      showToast("Failed to reply.", "error");
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const statusColor = (status) => {
    if (status === "resolved") return "#1abc9c";
    if (status === "open") return "#ffb120";
    if (status === "replied") return "#0984e3";
    return "#636e72";
  };

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
  ];

  return (
    <div style={{ padding: "2.5rem 0", minHeight: "100vh", background: "#101c2f",
      display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{
        fontWeight: 900, fontSize: 36, color: "#8cb7ff", marginBottom: 34,
        letterSpacing: "0.035em", textAlign: "center", textShadow: "0 3px 16px #23346465"
      }}>
        Feedback Management
      </h2>

      {/* Filter Section */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: 12, alignItems: "center", marginLeft: 20 }}>
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          style={{
            padding: "8px 16px", borderRadius: 6, backgroundColor: "#263556", color: "#fff", fontSize: 16,
            border: "1px solid #334155"
          }}
        >
          <option value="all">All Feedback</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="replied">Replied</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            padding: "8px 16px", borderRadius: 6, backgroundColor: "#263556", color: "#fff", fontSize: 16,
            border: "1px solid #334155"
          }}
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span style={{ color: "#9fb7e6", fontSize: 14 }}>
          Page {currentPage} / {totalPages} • {totalElements} total
        </span>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            style={{
              padding: "6px 12px", borderRadius: 6, border: "none", background: "#334c7a", color: "#fff",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer"
            }}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            style={{
              padding: "6px 12px", borderRadius: 6, border: "none", background: "#334c7a", color: "#fff",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: "#8ea8d8", fontSize: 22 }}>Loading...</div>
      ) : error ? (
        <div style={{ color: "#ff8888", fontSize: 19 }}>{error}</div>
      ) : (
        <div style={{
          background: "rgba(38, 45, 70, 0.98)", borderRadius: 20,
          boxShadow: "0 8px 36px #19224525", width: "99%", maxWidth: 1200,
          overflowX: "auto", marginBottom: 32
        }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 17, minWidth: 1100 }}>
            <thead>
              <tr style={{
                color: "#7fb8ff", fontWeight: 800, textAlign: "left", fontSize: 18.5,
                letterSpacing: "0.02em", background: "rgba(27,37,57,0.99)", userSelect: "none"
              }}>
                <th style={{ padding: "20px 16px 16px 26px", borderRadius: "18px 0 0 0" }}>ID</th>
                <th>User ID</th>
                <th style={{ minWidth: 200 }}>Message</th>
                <th>Created At</th>
                <th>Submitted At</th>
                <th>Reply</th>
                <th>Status</th>
                <th style={{ borderRadius: "0 18px 0 0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length ? feedbacks.map((fb, i) => (
                <tr key={fb.id}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #2d3756",
                    background: i % 2 === 0 ? "rgba(26,33,55,0.99)" : "rgba(38,45,70,0.98)",
                    transition: "background 0.17s"
                  }}
                >
                  <td style={{ padding: "15px 16px 15px 26px", color: "#a5ccff", fontWeight: 700 }}>{fb.id}</td>
                  <td style={{ color: "#7aaaff", fontWeight: 600 }}>{fb.userId ?? fb.user_id}</td>
                  <td style={{ color: "#e3ecff", maxWidth: 340, wordBreak: "break-word" }}>{fb.message}</td>
                  <td style={{ color: "#b4d2ff" }}>{String(fb.createdAt ?? "").replace("T", " ").slice(0, 19)}</td>
                  <td style={{ color: "#b4d2ff" }}>{String(fb.submittedAt ?? "").replace("T", " ").slice(0, 19)}</td>
                  <td style={{ color: "#17d3ec", fontWeight: 600 }}>
                    {fb.reply ? (
                      <span>
                        <span style={{ color: "#aee4ff", fontSize: 13, fontWeight: 400 }}>Replied:</span><br />{fb.reply}
                      </span>
                    ) : (
                      <span style={{ color: "#8889", fontStyle: "italic" }}>No reply</span>
                    )}
                  </td>
                  <td>
                    <span style={{
                      display: "inline-block", borderRadius: 8, fontWeight: 700, padding: "5px 18px",
                      color: "#fff", fontSize: 15, background: statusColor(fb.status), boxShadow: "0 1px 5px #2223",
                      letterSpacing: ".01em", minWidth: 78, textAlign: "center", textTransform: "capitalize"
                    }}>
                      {fb.status || "N/A"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 12 }}>
                      {fb.status === "open" && (
                        <button
                          onClick={() => { setReplyingId(fb.id); setReplyText(""); setReplyModalOpen(true); }}
                          disabled={replyModalOpen && replyingId === fb.id}
                          style={{
                            padding: "7px 18px", borderRadius: 8, border: "none", background: "#0984e3",
                            color: "#fff", fontWeight: 700, fontSize: 15,
                            cursor: replyModalOpen && replyingId === fb.id ? "not-allowed" : "pointer",
                            boxShadow: "0 1px 7px #0984e340"
                          }}
                          title="Reply"
                        >
                          <FaReply />
                        </button>
                      )}

                      {(fb.status === "open" || fb.status === "replied") && (
                        <button
                          onClick={() => handleResolve(fb.id)}
                          disabled={resolvingId === fb.id}
                          style={{
                            padding: "6px 15px", borderRadius: 7, border: "none",
                            background: resolvingId === fb.id ? "#23c48390" : "#23c483",
                            color: "#fff", fontWeight: 700, fontSize: 14, marginRight: 2,
                            cursor: resolvingId === fb.id ? "not-allowed" : "pointer",
                            boxShadow: resolvingId === fb.id ? "" : "0 1px 7px #23c48340"
                          }}
                          title="Mark as Resolved"
                        >
                          <FaCheck />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(fb.id)}
                        disabled={deletingId === fb.id}
                        style={{
                          padding: "7px 18px", borderRadius: 8, border: "none",
                          background: deletingId === fb.id ? "#e74c3c80" : "#e74c3c",
                          color: "#fff", fontWeight: 700, fontSize: 15,
                          cursor: deletingId === fb.id ? "not-allowed" : "pointer",
                          marginLeft: 2, boxShadow: deletingId === fb.id ? "" : "0 1px 7px #e74c3c30"
                        }}
                        title="Delete Feedback"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ color: "#8fa6c6", textAlign: "center", padding: "2.5rem", fontStyle: "italic" }}>
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />

      <ReplyModal
        open={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        onSubmit={() => handleReply(replyingId)}
        value={replyText}
        onChange={setReplyText}
      />
    </div>
  );
}

export default Feedback;
