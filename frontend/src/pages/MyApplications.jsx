import React, { useEffect, useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Clock, CheckCircle, XCircle, MapPin, Building2, Calendar } from "lucide-react";

function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user-applications", {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setApps(res.data);
      } catch (err) {
        console.error("Error fetching applications");
      } finally {
        setLoading(false);
      }
    };
    fetchMyApps();
  }, []);

  // Helper to get status-specific styles
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "hired":
        return { color: "#10b981", icon: <CheckCircle size={16} />, bg: "#ecfdf5" };
      case "rejected":
        return { color: "#ef4444", icon: <XCircle size={16} />, bg: "#fef2f2" };
      default:
        return { color: "#f59e0b", icon: <Clock size={16} />, bg: "#fffbeb" };
    }
  };

  return (
    <div className="container py-5">
      <header className="mb-5 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="fw-black text-uppercase letter-spacing-1 mb-1" style={{ fontSize: '2.5rem', fontWeight: 900 }}>
            Application <span className="text-muted">History</span>
          </h1>
          <p className="text-muted text-uppercase fw-bold small">Track your journey across {apps.length} roles</p>
        </div>
        <div className="d-none d-md-block text-end">
           <div className="p-3 border-start border-4 border-dark">
              <h5 className="mb-0 fw-bold">{apps.length}</h5>
              <small className="text-muted fw-bold">TOTAL APPS</small>
           </div>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : apps.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-5 border border-2 border-dashed border-dark"
        >
          <Briefcase size={48} className="text-muted mb-3" />
          <h4 className="fw-bold text-uppercase">No applications found</h4>
          <p className="text-muted">Your career journey starts with the first "Apply" click.</p>
        </motion.div>
      ) : (
        <div className="row g-4">
          <AnimatePresence>
            {apps.map((app, index) => {
              const statusConfig = getStatusConfig(app.status);
              return (
                <motion.div 
                  className="col-lg-6" 
                  key={app._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-3 bg-light rounded-3">
                            <Building2 size={24} className="text-dark" />
                          </div>
                          <div>
                            <h5 className="fw-bold mb-0">{app.jobId?.title || "Role Unavailable"}</h5>
                            <p className="text-muted mb-0 small fw-semibold">{app.jobId?.company || "Company Information Hidden"}</p>
                          </div>
                        </div>
                        <div 
                          className="d-flex align-items-center gap-2 px-3 py-1 fw-bold text-uppercase"
                          style={{ 
                            fontSize: '10px', 
                            borderRadius: '20px', 
                            color: statusConfig.color, 
                            backgroundColor: statusConfig.bg 
                          }}
                        >
                          {statusConfig.icon}
                          {app.status || "Pending"}
                        </div>
                      </div>

                      <hr className="text-muted opacity-25" />

                      <div className="row g-2">
                        <div className="col-6 d-flex align-items-center gap-2 text-muted small">
                          <MapPin size={14} />
                          {app.jobId?.location || "Remote"}
                        </div>
                        <div className="col-6 d-flex align-items-center gap-2 text-muted small">
                          <Calendar size={14} />
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
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

      <style>
        {`
          .letter-spacing-1 { letter-spacing: -1px; }
          .card { transition: transform 0.2s, box-shadow 0.2s; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; }
        `}
      </style>
    </div>
  );
}

export default MyApplications;