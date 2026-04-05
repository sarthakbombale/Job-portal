import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MapPin, DollarSign,
  Trash2, Edit3, Users,
  Building2, Image as ImageIcon
} from "lucide-react";

function Admin() {
  const [job, setJob] = useState({
    title: "", description: "", location: "",
    salary: "", experience: "", skills: "",
    companyName: "", companyLogo: ""
  });
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Sync Failed");
    }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Ensure the URL matches your backend route exactly: /jobs/:id
    const url = editingJobId ? `/jobs/${editingJobId}` : "/jobs";

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingJobId) {
        // Logic for Update (PUT)
        await API.put(url, job, config);
        toast.success("LISTING UPDATED");
      } else {
        // Logic for Create (POST)
        await API.post(url, job, config);
        toast.success("JOB PUBLISHED");
      }

      // Reset Form
      setJob({ title: "", description: "", location: "", salary: "", experience: "", skills: "", companyName: "", companyLogo: "" });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      // THIS WILL SHOW YOU THE REAL ERROR IN THE CONSOLE
      console.error("Full Error Object:", err);
      console.error("Server Response:", err.response?.data);

      const errorMsg = err.response?.data?.message || err.response?.data?.msg || "Action Failed";
      toast.error(errorMsg.toUpperCase());
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="admin-page-bg">
      <div className="admin-wrapper">

        {/* HEADER SECTION */}
        <header className="admin-nav">
          <div>
            <h2 className="m-0 fw-bold">Admin Console</h2>
            <p className="text-muted small mb-0">Managing listings for <strong>{name}</strong></p>
          </div>
          <div className="stats-badge">
            <span className="pulse-dot"></span>
            {jobs.length} Active Jobs
          </div>
        </header>

        <div className="admin-grid">
          {/* FORM SIDEBAR */}
          <aside className="admin-sidebar">
            <div className="admin-card sticky-card">
              <div className="card-label">
                {editingJobId ? <Edit3 size={16} /> : <Plus size={16} />}
                <span>{editingJobId ? "Edit Listing" : "Create Listing"}</span>
              </div>

              <form onSubmit={handleSubmit} className="mt-3">
                <div className="form-group-custom">
                  <label>Company Name</label>
                  <input type="text" placeholder="e.g. TechCorp" value={job.companyName} onChange={e => setJob({ ...job, companyName: e.target.value })} required />
                </div>

                <div className="form-group-custom">
                  <label>Logo URL</label>
                  <input type="text" placeholder="https://link-to-logo.png" value={job.companyLogo} onChange={e => setJob({ ...job, companyLogo: e.target.value })} />
                </div>

                <div className="form-group-custom">
                  <label>Job Title</label>
                  <input type="text" placeholder="Fullstack Developer" value={job.title} onChange={e => setJob({ ...job, title: e.target.value })} required />
                </div>

                <div className="row g-2">
                  <div className="col-6 form-group-custom">
                    <label>Location</label>
                    <input type="text" placeholder="Pune" value={job.location} onChange={e => setJob({ ...job, location: e.target.value })} />
                  </div>
                  <div className="col-6 form-group-custom">
                    <label>Salary</label>
                    <input type="text" placeholder="10 LPA" value={job.salary} onChange={e => setJob({ ...job, salary: e.target.value })} />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Description</label>
                  <textarea rows="3" value={job.description} onChange={e => setJob({ ...job, description: e.target.value })} required></textarea>
                </div>

                <button type="submit" className="btn-admin-primary mt-3">
                  {editingJobId ? "Update Posting" : "Publish Listing"}
                </button>
                {editingJobId && (
                  <button type="button" className="btn-admin-outline w-100 mt-2" onClick={() => { setEditingJobId(null); setJob({ title: "" }) }}>Cancel</button>
                )}
              </form>
            </div>
          </aside>

          {/* LISTINGS MAIN AREA */}
          <main className="admin-main">
            <div className="d-flex align-items-center gap-2 mb-4">
              <h5 className="fw-bold m-0">Live Postings</h5>
              <div className="flex-grow-1 border-bottom"></div>
            </div>

            {loading ? (
              <div className="text-center p-5"><div className="spinner-border spinner-border-sm"></div></div>
            ) : (
              <div className="listings-stack">
                <AnimatePresence>
                  {jobs.map(j => (
                    <motion.div
                      key={j._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="job-item-card"
                    >
                      <div className="job-item-left">
                        <div className="company-icon-box">
                          {j.companyLogo ? <img src={j.companyLogo} alt="logo" /> : <Building2 size={20} />}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{j.title}</h6>
                          <p className="company-text-small">{j.companyName}</p>
                          <div className="job-item-meta">
                            <span><MapPin size={12} /> {j.location}</span>
                            <span><DollarSign size={12} /> {j.salary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="job-item-actions">
                        <button className="btn-icon" onClick={() => navigate(`/admin/applicants/${j._id}`)}><Users size={16} /></button>
                        <button className="btn-icon" onClick={() => { setJob(j); setEditingJobId(j._id); window.scrollTo(0, 0) }}><Edit3 size={16} /></button>
                        <button className="btn-icon text-danger" onClick={() => executeDelete(j._id)}><Trash2 size={16} /></button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .admin-page-bg { background: #f4f7fe; min-height: 100vh; font-family: 'Inter', sans-serif; padding: 20px; }
        .admin-wrapper { max-width: 1100px; margin: 0 auto; padding: 20px 0; }
        
        .admin-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .stats-badge { background: #fff; padding: 8px 16px; border-radius: 50px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; border: 1px solid #e0e6ed; }
        .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; }

        .admin-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }

        .admin-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e0e6ed; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .sticky-card { position: sticky; top: 20px; }
        .card-label { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14px; text-transform: uppercase; color: #1e293b; }

        .form-group-custom { margin-bottom: 15px; }
        .form-group-custom label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 5px; }
        .form-group-custom input, .form-group-custom textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 14px; background: #f8fafc; outline: none; }
        .form-group-custom input:focus { border-color: #000; background: #fff; }

        .btn-admin-primary { width: 100%; background: #000; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 14px; }
        .btn-admin-outline { background: transparent; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 13px; color: #64748b; }

        .job-item-card { background: #fff; border: 1px solid #e0e6ed; border-radius: 12px; padding: 15px 20px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
        .job-item-card:hover { transform: translateX(5px); border-color: #cbd5e1; }
        
        .job-item-left { display: flex; align-items: center; gap: 15px; }
        .company-icon-box { width: 45px; height: 45px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #e2e8f0; }
        .company-icon-box img { width: 100%; height: 100%; object-fit: contain; }

        .company-text-small { color: #3b82f6; font-weight: 700; font-size: 12px; margin: 0; }
        .job-item-meta { display: flex; gap: 12px; font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }

        .job-item-actions { display: flex; gap: 8px; }
        .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .btn-icon:hover { background: #f8fafc; border-color: #000; color: #000; }

        @media (max-width: 900px) { .admin-grid { grid-template-columns: 1fr; } .sticky-card { position: static; } }
      `}</style>
    </div>
  );
}

export default Admin;