// components/Fallbacks.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, FileQuestion, RefreshCw, Home } from "lucide-react";

// 1. 404 PAGE NOT FOUND FALLBACK
export function NotFoundPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white text-center px-3" style={{ fontFamily: "'Inter', sans-serif" }}>
      <FileQuestion size={64} className="text-muted mb-4 opacity-70" />
      <h1 className="fw-black text-dark text-uppercase mb-2" style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-2px" }}>
        404 <span className="text-muted">Error</span>
      </h1>
      <p className="text-uppercase fw-bold small text-muted tracking-wider mb-4" style={{ letterSpacing: "1px" }}>
        The requested page does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-dark fw-bold text-uppercase px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2" style={{ fontSize: "11px" }}>
        <Home size={14} /> Back to Safety
      </Link>
    </div>
  );
}

// 2. NETWORK / API FAILURE FALLBACK
export function NetworkErrorPage({ onRetry }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white text-center px-3" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AlertCircle size={64} className="text-danger mb-4 opacity-70" />
      <h1 className="fw-black text-dark text-uppercase mb-2" style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-1.5px" }}>
        Connection <span className="text-muted">Lost</span>
      </h1>
      <p className="text-uppercase fw-bold small text-muted mb-4" style={{ maxWidth: "400px", fontSize: "12px", lineHeight: "1.6" }}>
        Unable to reach the server. Please check your internet connection or verify if the backend service is running.
      </p>
      <button 
        onClick={onRetry || (() => window.location.reload())} 
        className="btn btn-dark fw-bold text-uppercase px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2" 
        style={{ fontSize: "11px" }}
      >
        <RefreshCw size={14} /> Retry Connection
      </button>
    </div>
  );
}