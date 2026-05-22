"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin/messages");
      } else {
        setError(data.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style jsx global>{`
        /* Scoped page-specific styles */
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          position: relative;
          overflow: hidden;
          font-family: inherit;
          padding: 20px;
        }

        .login-glow-1 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(100, 255, 218, 0.08) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          z-index: 1;
          pointer-events: none;
        }

        .login-glow-2 {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(127, 119, 221, 0.08) 0%, transparent 70%);
          bottom: -150px;
          right: -150px;
          z-index: 1;
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(19, 20, 26, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 50px rgba(100, 255, 218, 0.02);
          z-index: 10;
          text-align: center;
          transform: translateY(0);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-card:hover {
          border-color: rgba(100, 255, 218, 0.25);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(100, 255, 218, 0.05);
        }

        .login-header h1 {
          color: var(--white);
          font-size: 2rem;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .login-header p {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 30px;
        }

        .login-header p span {
          color: var(--accent);
        }

        .form-group {
          text-align: left;
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          color: var(--text);
          font-size: 0.85rem;
          margin-bottom: 8px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .input-wrapper {
          position: relative;
        }

        .login-input {
          width: 100%;
          background: rgba(11, 12, 16, 0.8);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 14px 16px;
          color: var(--white);
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }

        .login-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 12px rgba(100, 255, 218, 0.15);
          background: rgba(11, 12, 16, 0.95);
        }

        .login-btn {
          width: 100%;
          background: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          padding: 14px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          letter-spacing: 0.5px;
        }

        .login-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(100, 255, 218, 0.15),
            transparent
          );
          transition: 0.5s;
        }

        .login-btn:hover::before {
          left: 100%;
        }

        .login-btn:hover {
          background: rgba(100, 255, 218, 0.08);
          box-shadow: 0 0 15px rgba(100, 255, 218, 0.2);
          transform: translateY(-2px);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .error-message {
          background: rgba(255, 99, 99, 0.08);
          border: 1px solid rgba(255, 99, 99, 0.2);
          color: #ff6b6b;
          border-radius: 8px;
          padding: 12px;
          font-size: 0.85rem;
          margin-bottom: 20px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-to-site {
          display: inline-block;
          margin-top: 25px;
          color: var(--muted);
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-to-site:hover {
          color: var(--accent);
        }
      `}</style>

      <div className="login-glow-1"></div>
      <div className="login-glow-2"></div>

      <div className="login-card">
        <div className="login-header">
          <h1>Admin Portal</h1>
          <p>Sign in to view your <span>portfolio messages</span></p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="adminPassword">Admin Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="adminPassword"
                className="login-input"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <a href="/" className="back-to-site">
          ← Back to Portfolio
        </a>
      </div>
    </div>
  );
}
