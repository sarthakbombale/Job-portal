import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // IMPORT THIS
import API from "../api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Zap, CheckCircle2, Building2, Clock, Cpu, ArrowRight } from "lucide-react";

function Jobs({ searchTerm }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // INITIALIZE NAVIGATE

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const getRelativeTime = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs", {
        headers: { Authorization: token }
      });
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  const apply = async (e, id) => {
    e.stopPropagation(); // Prevents navigation when clicking the apply button
    try {
      await API.post(`/apply/${id}`, {}, { headers: { Authorization: token } });
      toast.success("Application successful! 🚀");
      fetchJobs();
    } catch (err) { toast.error(err.response?.data?.msg || "Error applying"); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container pb-5 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="mb-5">
        <h1 className="display-6 fw-bold text-dark text-uppercase" style={{ letterSpacing: '-1.5px' }}>
          Explore <span className="text-muted">Opportunities</span>
        </h1>
        <p className="text-muted fw-bold small text-uppercase mb-0">
          {name} • {filteredJobs.length} roles available
        </p>
      </header>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
      ) : (
        <div className="row g-4">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <div className="col-lg-4 col-md-6" key={job._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/job/${job._id}`)} // NAVIGATE ON CLICK
                  className="card border-0 p-4 job-card-main standard-shadow h-100"
                  style={{ cursor: 'pointer', borderRadius: '24px' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2 px-2 py-1 bg-light rounded-pill border" style={{ fontSize: '10px' }}>
                      <Clock size={12} className="text-muted" />
                      <span className="fw-bold text-dark text-uppercase">{getRelativeTime(job.createdAt)}</span>
                    </div>
                    {job.isApplied && <CheckCircle2 size={20} className="text-success" />}
                  </div>

                  <div className="mb-3">
                    <h5 className="fw-black text-dark mb-1 text-uppercase">{job.title}</h5>
                    <div className="d-flex align-items-center gap-2 text-primary small fw-bold">
                      <Building2 size={14} /> <span>SCALEFULL TECH</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-1">
                      {job.skills?.split(',').slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-pill">{s.trim()}</span>
                      ))}
                      {job.skills?.split(',').length > 3 && <span className="small text-muted">+ more</span>}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mb-4">
                    <div className="flex-fill p-2 bg-dark text-white rounded-3 text-center">
                      <div style={{ fontSize: '7px', opacity: 0.6 }}>PACKAGE</div>
                      <div className="fw-bold" style={{ fontSize: '10px' }}>{job.salary || "N/A"}</div>
                    </div>
                    <div className="flex-fill p-2 border border-dark rounded-3 text-center">
                      <div style={{ fontSize: '7px', color: '#666' }}>EXP</div>
                      <div className="fw-bold text-dark" style={{ fontSize: '10px' }}>{job.experience || "0-1 Yrs"}</div>
                    </div>
                  </div>

                  <div className="mt-auto d-flex align-items-center justify-content-between">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className={`btn fw-bold text-uppercase px-4 py-2 rounded-pill ${job.isApplied ? "btn-light text-muted" : "btn-dark"}`}
                      onClick={(e) => apply(e, job._id)}
                      disabled={job.isApplied}
                      style={{ fontSize: '10px' }}
                    >
                      {job.isApplied ? "Applied" : "Quick Apply"}
                    </motion.button>
                    <ArrowRight size={18} className="text-muted" />
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <style>{`
        .job-card-main { transition: all 0.3s ease; border: 1px solid #eee !important; }
        .standard-shadow { box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .job-card-main:hover { transform: translateY(-5px); border-color: #000 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        .skill-pill { background: #f1f1f1; color: #444; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
        .fw-black { font-weight: 900; }
      `}</style>
    </div>
  );
}

export default Jobs;