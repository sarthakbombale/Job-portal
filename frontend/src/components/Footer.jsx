import React from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Added this to prevent 'role is undefined' error
  const location = useLocation();
  const year = new Date().getFullYear();

  // Hide footer on Login and Register pages
  if (!token || location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <footer className="border-top border-dark mt-5" style={{ backgroundColor: "#ffffff" }}>
      <div className="container">
        <div className="row align-items-center">
          
          {/* 1. Logo & Copyright Section */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <Link to={role === "admin" ? "/admin" : "/jobs"}>
              <img
                src="/job-genie.png"
                alt="JobGenie Logo"
                style={{
                  height: "80px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
            <div className="mt-1">
              <small className="text-muted" style={{ fontSize: "10px" }}>
                © {year} PUNE, MAHARASHTRA
              </small>
            </div>
          </div>

          {/* 2. Navigation Links */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center gap-4">
              <Link to="/jobs" className="text-dark text-decoration-none small fw-bold text-uppercase" style={{ fontSize: "11px" }}>Browse</Link>
              <Link to="/my-applications" className="text-dark text-decoration-none small fw-bold text-uppercase" style={{ fontSize: "11px" }}>History</Link>
              <Link to="/admin" className="text-dark text-decoration-none small fw-bold text-uppercase" style={{ fontSize: "11px" }}>Portal</Link>
            </div>
          </div>

          {/* 3. Tech Badge */}
          <div className="col-md-4 text-center text-md-end">
            <span className="badge border border-dark text-dark text-uppercase px-3 py-2" style={{ fontSize: "10px", borderRadius: "0px", fontWeight: "600" }}>
              MERN Stack System
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;