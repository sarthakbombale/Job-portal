import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, LogOut, Briefcase, History, LayoutDashboard } from "lucide-react";

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

  if (!token || ["/", "/register"].includes(location.pathname)) return null;

  return (
    <motion.nav 
      // Click Animation: Expands slightly then returns to normal
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="navbar navbar-expand-lg border-bottom sticky-top shadow-sm"
      style={{ 
        backgroundColor: "#ffffff", 
        borderBottom: "1.5px solid #e2e8f0 !important",
        padding: "1rem 0"
      }}
    >
      <div className="container">
        {/* Brand Logo with Hover Animation */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link className="navbar-brand d-flex align-items-center" to={role === "admin" ? "/admin" : "/jobs"}>
            <img 
              src="/job-genie.png" 
              alt="Logo" 
              style={{ height: "80px", width: "auto", objectFit: "contain" }} 
            />
          </Link>
        </motion.div>

        {/* Professional Search Bar */}
        {location.pathname === "/jobs" && (
          <div className="flex-grow-1 mx-lg-5 d-none d-md-block" style={{ maxWidth: "500px" }}>
            <div className="position-relative">
              <Search 
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
                size={18} 
              />
              <input 
                type="text"
                className="form-control ps-5 shadow-none border-0 bg-light"
                placeholder="Search jobs, skills, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  borderRadius: "12px", 
                  fontSize: '14px', 
                  height: "45px",
                  border: "1px solid transparent",
                  transition: "all 0.3s"
                }}
                onFocus={(e) => e.target.style.border = "1px solid #000"}
                onBlur={(e) => e.target.style.border = "1px solid transparent"}
              />
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="d-flex align-items-center gap-2">
          <div className="d-none d-lg-flex gap-2">
            {role === "admin" ? (
              <NavLink to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            ) : (
              <>
                <NavLink to="/jobs" icon={<Briefcase size={18} />} label="Feed" />
                <NavLink to="/my-applications" icon={<History size={18} />} label="History" />
              </>
            )}
          </div>
          
          <div className="ms-lg-3 border-start ps-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn d-flex align-items-center gap-2 fw-bold text-uppercase" 
              onClick={handleLogout}
              style={{ 
                fontSize: '11px', 
                backgroundColor: "#f1f5f9", 
                borderRadius: "10px", 
                color: "#475569" 
              }}
            >
              <LogOut size={14} />
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Reusable NavLink Component for cleaner code
function NavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`nav-link d-flex align-items-center gap-2 px-3 py-2 text-uppercase fw-bold`}
      style={{ 
        fontSize: '12px', 
        borderRadius: "10px",
        color: isActive ? "#000" : "#64748b",
        backgroundColor: isActive ? "#f8fafc" : "transparent",
        transition: "0.2s"
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

export default Navbar;