"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  // Fetch messages from database
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages");
      if (response.status === 401) {
        // Redirect to login if unauthorized
        router.push("/admin");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Handle Delete Message
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert("Failed to delete message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting message.");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container loading-state">
        <style jsx global>{`
          .admin-dashboard-container {
            min-height: 100vh;
            background: var(--bg);
            color: var(--text);
            font-family: inherit;
            padding: 40px 20px;
            position: relative;
          }
          .loading-state {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(100, 255, 218, 0.1);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s infinite linear;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <style jsx global>{`
        .admin-dashboard-container {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: inherit;
          padding: 40px 20px;
          position: relative;
        }

        .dashboard-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(100, 255, 218, 0.04) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 24px;
          margin-bottom: 35px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-title h1 {
          color: var(--white);
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .header-title p {
          color: var(--muted);
          font-size: 0.95rem;
        }

        .header-title p span {
          color: var(--accent);
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--text);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
          border-color: rgba(100, 255, 218, 0.3);
        }

        .btn-danger {
          background: rgba(255, 99, 99, 0.05);
          border: 1px solid rgba(255, 99, 99, 0.2);
          color: #ff6b6b;
        }

        .btn-danger:hover {
          background: rgba(255, 99, 99, 0.15);
          border-color: rgba(255, 99, 99, 0.4);
          box-shadow: 0 0 10px rgba(255, 99, 99, 0.15);
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        @media (min-width: 900px) {
          .grid-layout {
            grid-template-columns: 1.2fr 1.8fr;
          }
        }

        .messages-pane, .detail-pane {
          background: rgba(19, 20, 26, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .messages-pane::-webkit-scrollbar, .detail-pane::-webkit-scrollbar {
          width: 6px;
        }
        .messages-pane::-webkit-scrollbar-thumb, .detail-pane::-webkit-scrollbar-thumb {
          background: rgba(100, 255, 218, 0.2);
          border-radius: 3px;
        }

        .messages-pane h2, .detail-pane h2 {
          color: var(--white);
          font-size: 1.3rem;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .error-banner {
          background: rgba(255, 99, 99, 0.08);
          border: 1px solid rgba(255, 99, 99, 0.2);
          color: #ff6b6b;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 30px;
        }

        .empty-inbox {
          text-align: center;
          padding: 60px 20px;
          color: var(--muted);
        }

        .empty-inbox svg {
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-item-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          position: relative;
        }

        .message-item-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(100, 255, 218, 0.15);
          transform: translateX(4px);
        }

        .message-item-card.active {
          background: rgba(100, 255, 218, 0.04);
          border-color: var(--accent);
        }

        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
          gap: 10px;
        }

        .card-sender {
          color: var(--white);
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-date {
          color: var(--muted);
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .card-subject {
          color: var(--accent);
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-preview {
          color: var(--muted);
          font-size: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Detail Pane */
        .detail-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 250px;
          color: var(--muted);
          text-align: center;
        }

        .detail-placeholder svg {
          margin-bottom: 12px;
          opacity: 0.3;
        }

        .detail-meta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 16px;
        }

        @media (min-width: 600px) {
          .detail-meta-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .meta-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          color: var(--muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          color: var(--white);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .meta-value a {
          color: var(--accent);
          text-decoration: none;
        }
        .meta-value a:hover {
          text-decoration: underline;
        }

        .detail-message-body {
          background: rgba(11, 12, 16, 0.6);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 20px;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.6;
          white-space: pre-wrap;
          min-height: 200px;
          overflow-y: auto;
        }
      `}</style>

      <div className="dashboard-glow"></div>

      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Messages</h1>
            <p>
              Showing <span>{messages.length}</span> inquiries stored in database
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => router.push("/")}
              className="action-btn btn-secondary"
            >
              Portfolio Site
            </button>
            <button onClick={handleLogout} className="action-btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="grid-layout">
          {/* List Pane */}
          <div className="messages-pane">
            <h2>Inbox</h2>

            {messages.length === 0 ? (
              <div className="empty-inbox">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <p>No messages found. You're all caught up!</p>
              </div>
            ) : (
              <div className="message-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item-card ${
                      selectedMessage?.id === msg.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="card-header-row">
                      <span className="card-sender" title={msg.name}>
                        {msg.name}
                      </span>
                      <span className="card-date">{formatDate(msg.createdAt)}</span>
                    </div>
                    <div className="card-subject" title={msg.subject || "No Subject"}>
                      {msg.subject || "No Subject"}
                    </div>
                    <p className="card-preview">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Pane */}
          <div className="detail-pane">
            <h2>Details</h2>

            {selectedMessage ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      color: "var(--white)",
                      margin: 0,
                      fontSize: "1.2rem",
                    }}
                  >
                    {selectedMessage.subject || "No Subject"}
                  </h3>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="action-btn btn-danger"
                    disabled={deletingId === selectedMessage.id}
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                  >
                    {deletingId === selectedMessage.id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div className="detail-meta-grid">
                  <div className="meta-field">
                    <span className="meta-label">From Name</span>
                    <span className="meta-value">{selectedMessage.name}</span>
                  </div>
                  <div className="meta-field">
                    <span className="meta-label">Date Received</span>
                    <span className="meta-value">
                      {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                  <div className="meta-field" style={{ gridColumn: "1 / -1" }}>
                    <span className="meta-label">Email Address</span>
                    <span className="meta-value">
                      <a href={`mailto:${selectedMessage.email}`}>
                        {selectedMessage.email}
                      </a>
                    </span>
                  </div>
                </div>

                <div className="detail-message-body">
                  {selectedMessage.message}
                </div>
              </div>
            ) : (
              <div className="detail-placeholder">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <p>Select a message from the inbox to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
