import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.info("Logged Out Successfully");
  };

  if (!token) return null; // Don't show navbar on Login/Register pages

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 mb-4">
      <div className="container">
        {/* Replace text with your JobGenie Logo later if you want */}
        <Link className="navbar-brand fw-bold text-uppercase letter-spacing-2" to={role === "admin" ? "/admin" : "/jobs"}>
          JobGenie
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {role === "admin" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-uppercase small fw-bold" to="/admin">Dashboard</Link>
                </li>
                {/* Add more admin specific links here */}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-uppercase small fw-bold" to="/jobs">Browse Jobs</Link>
                </li>
                {/* Link to a future 'My Applications' page */}
                <li className="nav-item">
                  <Link className="nav-link text-uppercase small fw-bold" to="/my-applications">My Apps</Link>
                </li>
              </>
            )}
            
            <li className="nav-item ms-lg-3">
              <button 
                className="btn btn-outline-light btn-sm text-uppercase fw-bold px-3" 
                onClick={handleLogout}
                style={{ borderRadius: "0px", fontSize: "12px" }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;