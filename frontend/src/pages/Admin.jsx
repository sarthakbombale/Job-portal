import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Added ESLint ignore comment just in case your parser remains stubborn
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import {
  Plus, MapPin, DollarSign,
  Trash2, Edit3, Users,
  Building2, Briefcase, Code, Link as LinkIcon
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

  const experienceOptions = ["Freshers", "1-3 Years", "3-5 Years", "5+ Years"];
  const salaryOptions = ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10+ LPA"];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("SYNC FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingJobId ? `/jobs/${editingJobId}` : "/jobs";

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingJobId) {
        await API.put(url, job, config);
        toast.success("LISTING UPDATED");
      } else {
        await API.post(url, job, config);
        toast.success("JOB PUBLISHED");
      }

      setJob({ title: "", description: "", location: "", salary: "", experience: "", skills: "", companyName: "", companyLogo: "" });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Action Failed";
      toast.error(errorMsg.toUpperCase());
    }
  };

  const executeDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("DELETED");
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("DELETE FAILED");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="admin-page-bg">
      <div className="admin-wrapper">
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
          <aside className="admin-sidebar">
            <div className="admin-card sticky-card">
              <div className="card-label">
                {editingJobId ? <Edit3 size={16} /> : <Plus size={16} />}
                <span>{editingJobId ? "Edit Listing" : "Create Listing"}</span>
              </div>

              <form onSubmit={handleSubmit} className="mt-3">
                <div className="form-group-custom">
                  <label>Company Name</label>
                  <div className="input-with-icon">
                    <Building2 size={14} />
                    <input type="text" placeholder="e.g. TechCorp" value={job.companyName} onChange={e => setJob({ ...job, companyName: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Logo URL</label>
                  <div className="input-with-icon">
                    <LinkIcon size={14} />
                    <input type="text" placeholder="https://link-to-logo.png" value={job.companyLogo} onChange={e => setJob({ ...job, companyLogo: e.target.value })} />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Job Title</label>
                  <input type="text" placeholder="Fullstack Developer" value={job.title} onChange={e => setJob({ ...job, title: e.target.value })} required />
                </div>

                <div className="row g-2">
                  <div className="col-6 form-group-custom">
                    <label>Experience</label>
                    <select
                      className="admin-select-custom"
                      value={job.experience}
                      onChange={e => setJob({ ...job, experience: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select</option>
                      {experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="col-6 form-group-custom">
                    <label>Salary</label>
                    <select
                      className="admin-select-custom"
                      value={job.salary}
                      onChange={e => setJob({ ...job, salary: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select</option>
                      {salaryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Location</label>
                  <div className="input-with-icon">
                    <MapPin size={14} />
                    <input type="text" placeholder="Pune / Remote" value={job.location} onChange={e => setJob({ ...job, location: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Skills (comma separated)</label>
                  <div className="input-with-icon">
                    <Code size={14} />
                    <input type="text" placeholder="React, Node, MongoDB" value={job.skills} onChange={e => setJob({ ...job, skills: e.target.value })} />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Description</label>
                  <textarea rows="4" placeholder="Brief job summary..." value={job.description} onChange={e => setJob({ ...job, description: e.target.value })} required></textarea>
                </div>

                <button type="submit" className="btn-admin-primary mt-2">
                  {editingJobId ? "Update Posting" : "Publish Listing"}
                </button>
                {editingJobId && (
                  <button type="button" className="btn-admin-outline w-100 mt-2" onClick={() => { setEditingJobId(null); setJob({ title: "", description: "", location: "", salary: "", experience: "", skills: "", companyName: "", companyLogo: "" }) }}>Cancel Edit</button>
                )}
              </form>
            </div>
          </aside>

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
                    <motion.div key={j._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="job-item-card">
                      <div className="job-item-left">
                        <div className="company-icon-box">
                          {j.companyLogo ? <img src={j.companyLogo} alt="logo" /> : <Building2 size={20} className="text-muted" />}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{j.title}</h6>
                          <p className="company-text-small">{j.companyName}</p>
                          <div className="job-item-meta">
                            <span><MapPin size={12} /> {j.location}</span>
                            <span><Briefcase size={12} /> {j.experience}</span>
                            <span><DollarSign size={12} /> {j.salary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="job-item-actions">
                        <button className="btn-icon" onClick={() => navigate(`/admin/applicants/${j._id}`)} title="Applicants"><Users size={16} /></button>
                        <button className="btn-icon" onClick={() => { setJob(j); setEditingJobId(j._id); window.scrollTo({ top: 0, behavior: 'smooth' }) }} title="Edit"><Edit3 size={16} /></button>
                        <button className="btn-icon text-danger" onClick={() => executeDelete(j._id)} title="Delete"><Trash2 size={16} /></button>
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
        .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

        .admin-grid { display: grid; grid-template-columns: 360px 1fr; gap: 30px; align-items: start; }
        .admin-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e0e6ed; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .sticky-card { position: sticky; top: 100px; }
        .card-label { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }

        .form-group-custom { margin-bottom: 15px; }
        .form-group-custom label { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 6px; letter-spacing: 0.5px; }
        
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .input-with-icon input { padding-left: 35px !important; }

        .form-group-custom input, 
        .form-group-custom textarea { 
          width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; 
          font-size: 14px; background: #f8fafc; outline: none; transition: 0.2s; color: #1e293b;
        }

        /* HARD-CODED SELECT STYLING */
        .admin-select-custom {
          width: 100% !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 10px 35px 10px 12px !important;
          font-size: 14px !important;
          background-color: #f8fafc !important;
          color: #1e293b !important;
          outline: none !important;
          transition: 0.2s !important;
          cursor: pointer !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 14px !important;
        }

        .admin-select-custom:focus {
          border-color: #000 !important;
          background-color: #fff !important;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05) !important;
        }

        .form-group-custom input:focus, 
        .form-group-custom textarea:focus { 
          border-color: #000; background: #fff; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); 
        }

        .btn-admin-primary { width: 100%; background: #000; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 14px; transition: 0.2s; }
        .btn-admin-primary:hover { background: #333; transform: translateY(-1px); }
        .btn-admin-outline { background: transparent; border: 1px solid #e2e8f0; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 13px; color: #64748b; transition: 0.2s; }
        .btn-admin-outline:hover { background: #f1f5f9; color: #1e293b; }

        .job-item-card { background: #fff; border: 1px solid #e0e6ed; border-radius: 16px; padding: 18px 24px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .job-item-card:hover { transform: translateX(8px); border-color: #000; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        
        .job-item-left { display: flex; align-items: center; gap: 18px; }
        .company-icon-box { width: 50px; height: 50px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #e2e8f0; }
        .company-icon-box img { width: 100%; height: 100%; object-fit: contain; }

        .company-text-small { color: #2563eb; font-weight: 700; font-size: 12px; margin: 0; text-transform: uppercase; }
        .job-item-meta { display: flex; flex-wrap: wrap; gap: 15px; font-size: 12px; color: #64748b; margin-top: 6px; font-weight: 500; }
        .job-item-meta span { display: flex; align-items: center; gap: 4px; }

        .job-item-actions { display: flex; gap: 10px; }
        .btn-icon { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .btn-icon:hover { border-color: #000; color: #000; background: #f8fafc; }
        .btn-icon.text-danger:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

        @media (max-width: 992px) { .admin-grid { grid-template-columns: 1fr; } .sticky-card { position: static; } }

  
      `}</style>
    </div>
  );
}

export default Admin;