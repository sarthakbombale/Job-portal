import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

// Professional SVG Brand Icons (Failsafe)
const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

function Footer() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const year = new Date().getFullYear();

  // Hide footer on Auth pages
  if (!token || ["/", "/register"].includes(location.pathname)) return null;

  return (
    <footer className=" border-top bg-white mt-5">
      <div className="container">
        <div className="row align-items-center g-4">
          
          {/* 1. Brand & Location */}
          <div className="col-md-4 text-center text-md-start">
            <img src="/job-genie.png" alt="JobGenie" style={{ height: "100px" }} />
            <div className="mt-3 d-flex align-items-center justify-content-center justify-content-md-start gap-2 text-muted">
              <MapPin size={14} />
              <small className="fw-bold text-uppercase letter-spacing-1">Pune, Maharashtra</small>
            </div>
          </div>

          {/* 2. Navigation & Socials */}
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center gap-4 mb-3">
              <Link to="/jobs" className="text-dark text-decoration-none small fw-bold text-uppercase">Browse</Link>
              <Link to="/my-applications" className="text-dark text-decoration-none small fw-bold text-uppercase">History</Link>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <SocialIcon href="https://github.com/sarthakbombale" icon={<GithubIcon />} hoverColor="#333" />
              <SocialIcon href="https://www.linkedin.com/in/sarthak-bombale-387705387" icon={<LinkedinIcon />} hoverColor="#0077b5" />
              <SocialIcon href="mailto:support@jobgenie.com" icon={<Mail size={20} />} hoverColor="#ea4335" />
            </div>
          </div>

          {/* 3. Tech Badge */}
          <div className="col-md-4 text-center text-md-end">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-light rounded-pill border">
              <ShieldCheck size={16} className="text-success" />
              <span className="fw-bold text-uppercase text-dark" style={{ fontSize: "10px" }}>
                MERN Stack v1.0
              </span>
            </div>
          </div>

        </div>
        <div className="text-center">
          <p className="text-muted mb-0" style={{ fontSize: "11px" }}>© {year} All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

// Helper for Social Links
function SocialIcon({ href, icon, hoverColor }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-muted"
      whileHover={{ y: -3, color: hoverColor }}
      style={{ transition: "color 0.2s" }}
    >
      {icon}
    </motion.a>
  );
}

export default Footer;