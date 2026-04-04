import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Briefcase, MapPin, DollarSign, 
  Award, Code, Trash2, Edit3, Users, 
  X, Search, ChevronRight 
} from "lucide-react";

function Admin() {
  const [job, setJob] = useState({ 
    title: "", description: "", location: "", 
    salary: "", experience: "", skills: "" 
  });
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) { toast.error("Sync Failed"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job.title || !job.description) {
      toast.warning("Title and Description are required");
      return;
    }
    const endpoint = editingJobId ? `/jobs/${editingJobId}` : "/jobs";
    const method = editingJobId ? "put" : "post";

    try {
      await API[method](endpoint, job, { headers: { Authorization: token } });
      toast.success(editingJobId ? "Listing Updated" : "Job Published");
      setJob({ title: "", description: "", location: "", salary: "", experience: "", skills: "" });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) { toast.error("Action failed"); }
  };

  const executeDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`, { headers: { Authorization: token } });
      fetchJobs();
      toast.success("Job Removed");
    } catch (err) { toast.error("Delete failed"); }
  };

  const startEdit = (j) => {
    setJob({ ...j });
    setEditingJobId(j._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="admin-container">
      <div className="content-wrapper">
        
        {/* TOP NAV BAR */}
        <header className="admin-header">
          <div className="header-left">
            <h2 className="brand-text">Dashboard</h2>
            <p className="welcome-text">Welcome back, <span>{name}</span></p>
          </div>
          <div className="header-right">
            <div className="stats-pill">
              <div className="dot"></div>
              {jobs.length} Active Posts
            </div>
          </div>
        </header>

        <div className="main-grid">
          {/* LEFT COLUMN: FORM */}
          <aside className="form-sidebar">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card sticky-form"
            >
              <div className="card-header">
                <div className="icon-circle">
                  {editingJobId ? <Edit3 size={18}/> : <Plus size={18}/>}
                </div>
                <h3>{editingJobId ? "Edit Position" : "New Listing"}</h3>
              </div>

              <form onSubmit={handleSubmit} className="styled-form">
                <div className="input-group">
                  <label>Job Title</label>
                  <input type="text" placeholder="Software Engineer" value={job.title} onChange={(e) => setJob({...job, title: e.target.value})} />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Location</label>
                    <input type="text" placeholder="Pune / Remote" value={job.location} onChange={(e) => setJob({...job, location: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Salary</label>
                    <input type="text" placeholder="8-12 LPA" value={job.salary} onChange={(e) => setJob({...job, salary: e.target.value})} />
                  </div>
                </div>

                <div className="input-group">
                  <label>Key Skills</label>
                  <input type="text" placeholder="React, Node, MongoDB" value={job.skills} onChange={(e) => setJob({...job, skills: e.target.value})} />
                </div>

                <div className="input-group">
                  <label>Description</label>
                  <textarea rows="4" placeholder="Briefly describe the role..." value={job.description} onChange={(e) => setJob({...job, description: e.target.value})} />
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    {editingJobId ? "Save Changes" : "Publish Job"}
                  </button>
                  {editingJobId && (
                    <button type="button" className="cancel-btn" onClick={() => { setEditingJobId(null); setJob({title:"", description:"", location:"", salary:"", experience:"", skills:""}) }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </aside>

          {/* RIGHT COLUMN: LISTINGS */}
          <main className="listings-area">
            <div className="section-title">
              <h4>Live Postings</h4>
              <div className="title-line"></div>
            </div>

            <div className="jobs-list">
              <AnimatePresence mode="popLayout">
                {jobs.map((j) => (
                  <motion.div 
                    layout 
                    key={j._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="job-row-card"
                  >
                    <div className="job-info">
                      <div className="job-main">
                        <h5>{j.title}</h5>
                        <div className="job-meta">
                          <span><MapPin size={12}/> {j.location}</span>
                          <span className="separator">•</span>
                          <span><DollarSign size={12}/> {j.salary || "Not Disclosed"}</span>
                        </div>
                      </div>
                      <div className="job-tags">
                        {j.skills?.split(',').slice(0, 3).map((s, i) => (
                          <span key={i} className="skill-tag">{s.trim()}</span>
                        ))}
                      </div>
                    </div>

                    <div className="job-actions">
                      <button className="action-btn view" onClick={() => navigate(`/admin/applicants/${j._id}`)}>
                        <Users size={16}/>
                        <span>Applicants</span>
                      </button>
                      <button className="action-btn edit" onClick={() => startEdit(j)}>
                        <Edit3 size={16}/>
                      </button>
                      <button className="action-btn delete" onClick={() => executeDelete(j._id)}>
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .admin-container {
          background-color: #f8fafc;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1e293b;
          padding: 0 20px;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 0;
        }

        /* HEADER */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .brand-text { font-weight: 800; font-size: 24px; letter-spacing: -0.5px; margin: 0; }
        .welcome-text { color: #64748b; font-size: 14px; margin: 0; }
        .welcome-text span { color: #0f172a; font-weight: 700; }

        .stats-pill {
          background: #fff;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          border: 1px solid #e2e8f0;
        }

        .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }

        /* GRID SYSTEM */
        .main-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 40px;
          align-items: start;
        }

        /* SIDEBAR FORM */
        .glass-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
        }

        .sticky-form { position: sticky; top: 40px; }

        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .card-header h3 { font-size: 18px; font-weight: 700; margin: 0; }

        .icon-circle {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
        }

        .input-group { margin-bottom: 16px; }
        .input-group label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #475569; }
        
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        input, textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          font-weight: 500;
          background: #f8fafc;
          transition: all 0.2s;
        }

        input:focus, textarea:focus {
          outline: none;
          background: #fff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .primary-btn {
          width: 100%;
          padding: 12px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.1s, opacity 0.2s;
        }

        .primary-btn:hover { opacity: 0.9; }
        .primary-btn:active { transform: scale(0.98); }

        .cancel-btn {
          width: 100%;
          margin-top: 8px;
          background: transparent;
          border: 1px solid #e2e8f0;
          padding: 10px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 13px;
          color: #64748b;
        }

        /* LISTINGS AREA */
        .section-title { display: flex; align-items: center; gap: 15px; margin-bottom: 24px; }
        .section-title h4 { font-size: 16px; font-weight: 800; margin: 0; white-space: nowrap; }
        .title-line { height: 1px; background: #e2e8f0; width: 100%; }

        .jobs-list { display: flex; flex-direction: column; gap: 12px; }

        .job-row-card {
          background: #fff;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .job-row-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
          transform: translateX(4px);
        }

        .job-main h5 { font-size: 15px; font-weight: 700; margin: 0 0 4px 0; }
        .job-meta { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 12px; font-weight: 600; }
        .separator { opacity: 0.3; }

        .job-tags { margin-top: 8px; display: flex; gap: 6px; }
        .skill-tag {
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .job-actions { display: flex; gap: 8px; align-items: center; }

        .action-btn {
          height: 38px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.view { padding: 0 12px; gap: 6px; font-weight: 700; font-size: 12px; }
        .action-btn.view:hover { background: #0f172a; color: #fff; border-color: #0f172a; }

        .action-btn.edit { width: 38px; }
        .action-btn.edit:hover { background: #f1f5f9; color: #0f172a; }

        .action-btn.delete { width: 38px; }
        .action-btn.delete:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }

        @media (max-width: 992px) {
          .main-grid { grid-template-columns: 1fr; }
          .sticky-form { position: static; }
        }
      `}</style>
    </div>
  );
}

export default Admin;