import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.info("Logged Out Successfully");
  };

  // Guard: Don't show Navbar on Login/Register
  if (!token || ["/", "/register"].includes(location.pathname)) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-dark py-3 mb-5 sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to={role === "admin" ? "/admin" : "/jobs"}>
          <img 
            src="/job-genie.png" 
            alt="Logo" 
            style={{ height: "40px", width: "auto", objectFit: "contain" }} 
          />
        </Link>

        {/* Global Search Bar (Only for /jobs) */}
        {location.pathname === "/jobs" && (
          <div className="flex-grow-1 mx-md-5 d-none d-md-block">
            <div className="input-group">
              <span className="input-group-text bg-white border-dark border-end-0 rounded-0">
                <small>🔍</small>
              </span>
              <input 
                type="text"
                className="form-control border-dark border-start-0 rounded-0 shadow-none ps-0"
                placeholder="SEARCH POSITIONS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '13px', fontWeight: '500' }}
              />
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="d-flex align-items-center gap-4">
          <div className="d-none d-lg-flex gap-4">
            {role === "admin" ? (
              <Link className="text-dark fw-bold text-uppercase text-decoration-none small" to="/admin">Admin Panel</Link>
            ) : (
              <>
                <Link className="text-dark fw-bold text-uppercase text-decoration-none small" to="/jobs">Feed</Link>
                <Link className="text-dark fw-bold text-uppercase text-decoration-none small" to="/my-applications">History</Link>
              </>
            )}
          </div>
          
          <button 
            className="btn btn-dark btn-sm rounded-0 px-3 fw-bold text-uppercase" 
            onClick={handleLogout}
            style={{ fontSize: '11px' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;