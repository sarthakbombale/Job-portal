import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Clock, CheckCircle, XCircle, MapPin, Building2, Calendar, ChevronLeft } from "lucide-react";

function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user-applications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setApps(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApps();
  }, []);

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "hired":
        return { color: "#10b981", icon: <CheckCircle size={14} />, bg: "#ecfdf5" };
      case "rejected":
        return { color: "#ef4444", icon: <XCircle size={14} />, bg: "#fef2f2" };
      default:
        return { color: "#f59e0b", icon: <Clock size={14} />, bg: "#fffbeb" };
    }
  };

  return (
    <div className="container py-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* BACK NAVIGATION */}
      <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <div>
          <h1 className="fw-black text-uppercase mb-1" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>
            Application <span className="text-muted">History</span>
          </h1>
          <p className="text-muted text-uppercase fw-bold small mb-0">
            Manage your {apps.length} submitted {apps.length === 1 ? 'role' : 'roles'}
          </p>
        </div>

        {/* BACK TO LISTING MOVED TO RIGHT */}
        <Link
          to="/jobs"
          className="text-decoration-none text-dark fw-bold small d-inline-flex align-items-center gap-1 hover-opacity pb-1"
        >
          <ChevronLeft size={18} className="rotate-180" />
          BACK TO LISTING
        </Link>
      </header>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
      ) : apps.length === 0 ? (
        <div className="text-center py-5 border border-2 border-dashed border-dark rounded-4 bg-light">
          <Briefcase size={40} className="text-muted mb-3" />
          <h5 className="fw-bold text-uppercase">No Applications Yet</h5>
          <p className="text-muted small mb-4">Go to the job board to find your next opportunity.</p>
          <Link to="/jobs" className="btn btn-dark fw-bold text-uppercase px-4 py-2" style={{ borderRadius: '10px', fontSize: '0.8rem' }}>
            Browse All Jobs
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <AnimatePresence>
            {apps.map((app, index) => {
              const statusConfig = getStatusConfig(app.status);
              const job = app.jobId || {};

              return (
                <motion.div
                  className="col-lg-6"
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '20px', border: '1px solid #eee !important' }}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: '50px', height: '50px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              background: '#fff', borderRadius: '12px',
                              border: '1px solid #f0f0f0', overflow: 'hidden', flexShrink: 0
                            }}
                          >
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }}
                              />
                            ) : (
                              <Building2 size={22} className="text-muted opacity-50" />
                            )}
                          </div>

                          <div>
                            <h5 className="fw-bold mb-0 text-uppercase" style={{ fontSize: '0.95rem' }}>
                              {job.title || "Position Unavailable"}
                            </h5>
                            <p className="text-primary mb-0 small fw-bold text-uppercase">
                              {job.companyName || "Unknown Company"}
                            </p>
                          </div>
                        </div>

                        <div
                          className="d-flex align-items-center gap-1 px-3 py-1 fw-bold text-uppercase"
                          style={{
                            fontSize: '9px', borderRadius: '20px',
                            color: statusConfig.color, backgroundColor: statusConfig.bg,
                            border: `1px solid ${statusConfig.color}30`
                          }}
                        >
                          {statusConfig.icon} {app.status || "Applied"}
                        </div>
                      </div>

                      <hr className="my-3 opacity-25" />

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 text-muted small fw-bold">
                          <MapPin size={14} className="text-dark" />
                          {job.location || "Location N/A"}
                        </div>

                        <div className="d-flex align-items-center gap-2 text-muted small fw-bold">
                          <Calendar size={14} className="text-dark" />
                          <span style={{ fontSize: '9px', opacity: 0.7 }}>APPLIED:</span>
                          <span>
                            {app.appliedAt ? (
                              new Date(app.appliedAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            ) : (
                              "Date N/A"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <style>{`
          .fw-black { font-weight: 900; }
          .card { transition: all 0.3s ease; }
          .card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
          .hover-opacity:hover { opacity: 0.7; }
      `}</style>
    </div>
  );
}

export default MyApplications;