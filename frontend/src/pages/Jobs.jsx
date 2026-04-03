import React, { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Zap, CheckCircle2, Building2, SearchX } from "lucide-react";

function Jobs({ searchTerm }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs", { headers: { Authorization: token } });
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  const apply = async (id) => {
    try {
      await API.post(`/apply/${id}`, {}, { headers: { Authorization: token } });
      toast.success("Application successful! 🚀");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error applying");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container pb-5 mt-2">
      <header className="mb-5">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="display-5 fw-bold text-dark"
        >
          Explore <span className="text-muted">Opportunities</span>
        </motion.h1>
        <p className="text-muted fw-semibold small text-uppercase letter-spacing-1">
          Welcome back, {name} • {filteredJobs.length} roles match your profile
        </p>
      </header>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          <AnimatePresence>
            {filteredJobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-12 text-center py-5 bg-light rounded-4 border"
              >
                <SearchX size={48} className="text-muted mb-3" />
                <h4 className="fw-bold text-dark">No matching roles</h4>
                <p className="text-muted">Try adjusting your search terms or filters.</p>
              </motion.div>
            ) : (
              filteredJobs.map((job, index) => (
                <div className="col-lg-4 col-md-6" key={job._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="card h-100 border-0 shadow-sm p-4 job-card-modern"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2 px-2 py-1 bg-light rounded-2 text-muted small fw-bold">
                        <MapPin size={14} />
                        {job.location.toUpperCase()}
                      </div>
                      {job.isApplied && (
                        <CheckCircle2 size={22} className="text-success" />
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-2">
                       <Building2 size={16} className="text-primary" />
                       <span className="text-primary small fw-bold text-uppercase">{job.company || "Hiring Co."}</span>
                    </div>
                    
                    <h4 className="fw-bold text-dark mb-3">{job.title}</h4>
                    <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.6' }}>
                      {job.description}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className={`btn w-100 fw-bold text-uppercase mt-4 py-2 d-flex align-items-center justify-content-center gap-2 ${
                        job.isApplied ? "btn-light text-muted" : "btn-dark shadow-sm"
                      }`}
                      onClick={() => !job.isApplied && apply(job._id)}
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        borderRadius: '10px',
                        cursor: job.isApplied ? "not-allowed" : "pointer",
                        pointerEvents: "auto"
                      }}
                      disabled={job.isApplied}
                    >
                      {job.isApplied ? (
                        <>Applied</>
                      ) : (
                        <><Zap size={14} /> Quick Apply</>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      <style>
        {`
          .job-card-modern {
            background: #ffffff;
            border-radius: 18px;
            transition: box-shadow 0.3s ease;
          }
          .job-card-modern:hover {
            box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
          }
          .letter-spacing-1 { letter-spacing: 1px; }
        `}
      </style>
    </div>
  );
}

export default Jobs;