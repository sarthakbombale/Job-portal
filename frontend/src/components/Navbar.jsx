import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
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
      whileTap={{ scale: 0.998 }}
      className="navbar border-bottom sticky-top shadow-sm py-2"
      style={{ backgroundColor: "#ffffff", zIndex: 1050 }}
    >
      <div className="container-fluid px-1 px-sm-3">
        <div className="d-flex align-items-center w-100 justify-content-between">
          
          {/* 1. Logo - Forced to stay visible */}
          <Link className="navbar-brand d-flex align-items-center flex-shrink-0 me-1 me-sm-3" to={role === "admin" ? "/admin" : "/jobs"}>
            <img 
              src="/job-genie.png" 
              alt="Logo" 
              className="responsive-logo"
            />
          </Link>

          {/* 2. Search Bar - Flexible and always present on /jobs */}
          {location.pathname === "/jobs" && (
            <div className="flex-grow-1 mx-1 mx-sm-2" style={{ minWidth: "0" }}>
              <div className="position-relative w-100">
                <Search 
                  className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted search-icon-responsive" 
                />
                <input 
                  type="text"
                  className="form-control shadow-none border-0 bg-light search-input-responsive"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 3. Icons - Forced to stay visible */}
          <div className="d-flex align-items-center flex-shrink-0 gap-1 gap-sm-2">
            <div className="d-flex gap-1">
              {role === "admin" ? (
                <IconNavLink to="/admin" icon={<LayoutDashboard size={18} />} />
              ) : (
                <>
                  <IconNavLink to="/jobs" icon={<Briefcase size={18} />} />
                  <IconNavLink to="/my-applications" icon={<History size={18} />} />
                </>
              )}
            </div>
            
            <div className="ms-1 border-start ps-1 ps-sm-2">
              <button 
                className="btn-logout-small" 
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* Core Sizing */
        .responsive-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
        }

        .search-input-responsive {
          border-radius: 8px;
          font-size: 13px;
          height: 36px;
          padding-left: 32px !important;
          background: #f1f5f9 !important;
          width: 100%;
        }

        .search-icon-responsive {
          width: 14px;
          height: 14px;
        }

        /* Nav Icons */
        .icon-nav-link {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #64748b;
          transition: 0.2s;
          text-decoration: none;
        }

        .icon-nav-link.active {
          background-color: #000;
          color: #fff;
        }

        .btn-logout-small {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #fee2e2;
          color: #ef4444;
          border: none;
        }

        /* RESPONSIVE FIXES FOR ALL SCREENS */
        @media (max-width: 576px) {
          .responsive-logo { height: 32px; }
          .search-input-responsive { font-size: 12px; height: 32px; padding-left: 28px !important; }
          .icon-nav-link, .btn-logout-small { width: 30px; height: 30px; }
          .icon-nav-link svg, .btn-logout-small svg { width: 16px; height: 16px; }
        }

        /* ULTRA NARROW DEVICES (iPhone SE / Fold) */
        @media (max-width: 360px) {
          .responsive-logo { width: 28px; height: 28px; content: url('/favicon.ico'); } /* Swaps to icon only to save 100px of space */
          .container-fluid { padding-left: 4px; padding-right: 4px; }
        }
      `}</style>
    </motion.nav>
  );
}

function IconNavLink({ to, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`icon-nav-link ${isActive ? 'active' : ''}`}>
      {icon}
    </Link>
  );
}

export default Navbar;