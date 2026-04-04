import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion"; // For smooth animations

function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Professional Toast Style
  const toastStyle = {
    borderRadius: "0px",
    border: "1px solid #000",
    fontSize: "12px",
    textTransform: "uppercase",
    fontWeight: "bold"
  };

  useEffect(() => {
    // 1. PREVENT FETCH IF JOBID IS GONE (Fixes the toast error on navigate back)
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applicants/${jobId}`, {
          headers: { Authorization: token },
        });
        setApplicants(res.data);
      } catch (err) {
        // Only show error if the component is still mounted and jobId exists
        if (jobId) {
          toast.error("DATA FETCH FAILED", { style: toastStyle });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId, token]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mt-5" 
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center border-bottom border-dark pb-3 mb-4">
        <h2 className="fw-bold text-uppercase m-0" style={{ letterSpacing: '1px' }}>
          Applicant Records
        </h2>
        <button 
          className="btn btn-dark fw-bold btn-sm rounded-0 px-4" 
          onClick={() => navigate("/admin")}
        >
          BACK TO DASHBOARD
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center mt-5"
          >
            <div className="spinner-border text-dark spinner-border-sm me-2"></div>
            <span className="text-uppercase small fw-bold">Syncing Records...</span>
          </motion.div>
        ) : applicants.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mt-5 py-5 border border-dark border-dashed"
          >
            <p className="text-muted text-uppercase fw-bold m-0" style={{ fontSize: '12px' }}>
              No applications received for this position yet.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="table-responsive"
          >
            <table className="table table-hover border-dark align-middle">
              <thead className="table-dark">
                <tr>
                  <th className="text-uppercase small p-3">Candidate Name</th>
                  <th className="text-uppercase small p-3">Email Address</th>
                  <th className="text-uppercase small p-3">Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app, index) => (
                  <motion.tr 
                    key={app._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }} // Staggered entrance
                  >
                    <td className="fw-bold p-3">{app.userId?.name || "N/A"}</td>
                    <td className="p-3">{app.userId?.email || "N/A"}</td>
                    <td className="small text-muted p-3 text-uppercase">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Applicants;