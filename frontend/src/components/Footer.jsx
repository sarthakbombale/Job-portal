import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-top border-dark mt-auto py-4" style={{ backgroundColor: "#ffffff" }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Brand Section */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <h5 className="fw-bold text-uppercase m-0" style={{ letterSpacing: "1px" }}>
              Job<span className="text-muted">Genie
</span>
            </h5>
            <p className="small text-muted mb-0">© {year} All Rights Reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center gap-3">
              <Link to="/jobs" className="text-dark text-decoration-none small fw-bold text-uppercase">Jobs</Link>
              <Link to="/my-applications" className="text-dark text-decoration-none small fw-bold text-uppercase">Applied</Link>
              <Link to="/admin" className="text-dark text-decoration-none small fw-bold text-uppercase">Admin</Link>
            </div>
          </div>

          {/* Tech Stack / Credit */}
          <div className="col-md-4 text-center text-md-end">
            <p className="small m-0 fw-bold text-uppercase">
              Built with <span className="text-danger">❤</span> JobGenie

            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;