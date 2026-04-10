import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import {
  Plus, MapPin, DollarSign,
  Trash2, Edit3, Users,
  Building2, Briefcase, Code, Link as LinkIcon,
  CheckCircle2, SlidersHorizontal
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
  
  // State for managing dropdown visibility
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isExpOpen, setIsExpOpen] = useState(false);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);

  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const experienceOptions = ["Freshers", "1-3 Years", "3-5 Years", "5+ Years"];
  const salaryOptions = ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10+ LPA"];
  const cityOptions = [
    "Pune", "Mumbai", "Bangalore", "Delhi",
    "Remote", "Hyderabad", "Chennai", "Gurgaon",
    "Noida", "Ahmedabad", "Kolkata", "Surat"
  ];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-select-wrapper")) {
        setIsLocationOpen(false);
        setIsExpOpen(false);
        setIsSalaryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="admin-page-bg">
      <div className="container-fluid admin-wrapper">
        <header className="admin-nav flex-column flex-md-row align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="m-0 fw-bold">Admin Console</h2>
            <p className="text-muted small mb-0">Managing listings for <strong>{name}</strong></p>
          </div>
          <div className="stats-badge">
            <span className="pulse-dot"></span>
            {jobs.length} Active Jobs
          </div>
        </header>

        <div className="row g-4">
          <aside className="col-12 col-lg-4">
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
                  {/* Custom Experience Dropdown */}
                  <div className="col-6 form-group-custom">
                    <label>Experience</label>
                    <div className="custom-select-wrapper position-relative" style={{ zIndex: isExpOpen ? 1002 : 1 }}>
                      <div
                        className={`custom-select-trigger ${isExpOpen ? 'active' : ''}`}
                        onClick={() => { setIsExpOpen(!isExpOpen); setIsSalaryOpen(false); setIsLocationOpen(false); }}
                      >
                        <Briefcase size={12} className="text-muted" />
                        <span className={job.experience ? "text-dark" : "text-muted"}>
                          {job.experience || "Select"}
                        </span>
                      </div>
                      <AnimatePresence>
                        {isExpOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 5 }} exit={{ opacity: 0, y: -10 }}
                            className="custom-options-container"
                          >
                            {experienceOptions.map((opt) => (
                              <div
                                key={opt}
                                className={`option-item ${job.experience === opt ? 'selected' : ''}`}
                                onClick={() => { setJob({ ...job, experience: opt }); setIsExpOpen(false); }}
                              >
                                {opt}
                                {job.experience === opt && <CheckCircle2 size={12} className="text-success ms-auto" />}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Custom Salary Dropdown */}
                  <div className="col-6 form-group-custom">
                    <label>Salary</label>
                    <div className="custom-select-wrapper position-relative" style={{ zIndex: isSalaryOpen ? 1002 : 1 }}>
                      <div
                        className={`custom-select-trigger ${isSalaryOpen ? 'active' : ''}`}
                        onClick={() => { setIsSalaryOpen(!isSalaryOpen); setIsExpOpen(false); setIsLocationOpen(false); }}
                      >
                        <DollarSign size={12} className="text-muted" />
                        <span className={job.salary ? "text-dark" : "text-muted"}>
                          {job.salary || "Select"}
                        </span>
                      </div>
                      <AnimatePresence>
                        {isSalaryOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 5 }} exit={{ opacity: 0, y: -10 }}
                            className="custom-options-container"
                          >
                            {salaryOptions.map((opt) => (
                              <div
                                key={opt}
                                className={`option-item ${job.salary === opt ? 'selected' : ''}`}
                                onClick={() => { setJob({ ...job, salary: opt }); setIsSalaryOpen(false); }}
                              >
                                {opt}
                                {job.salary === opt && <CheckCircle2 size={12} className="text-success ms-auto" />}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Location</label>
                  <div className="custom-select-wrapper position-relative" style={{ zIndex: isLocationOpen ? 1001 : 0 }}>
                    <div
                      className={`custom-select-trigger ${isLocationOpen ? 'active' : ''}`}
                      onClick={() => { setIsLocationOpen(!isLocationOpen); setIsExpOpen(false); setIsSalaryOpen(false); }}
                    >
                      <MapPin size={14} className="text-muted" />
                      <span className={job.location ? "text-dark" : "text-muted"}>
                        {job.location || "Select City"}
                      </span>
                      <motion.div animate={{ rotate: isLocationOpen ? 180 : 0 }} className="ms-auto">
                        <SlidersHorizontal size={12} />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isLocationOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 5, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="custom-options-container"
                        >
                          {cityOptions.map((city) => (
                            <motion.div
                              key={city}
                              whileHover={{ x: 5, backgroundColor: "#f1f5f9" }}
                              className={`option-item ${job.location === city ? 'selected' : ''}`}
                              onClick={() => {
                                setJob({ ...job, location: city });
                                setIsLocationOpen(false);
                              }}
                            >
                              {city}
                              {job.location === city && <CheckCircle2 size={12} className="text-success ms-auto" />}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
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

          <main className="col-12 col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-4">
              <h5 className="fw-bold m-0 text-nowrap">Live Postings</h5>
              <div className="flex-grow-1 border-bottom"></div>
            </div>

            {loading ? (
              <div className="text-center p-5"><div className="spinner-border spinner-border-sm"></div></div>
            ) : (
              <div className="listings-stack">
                <AnimatePresence>
                  {jobs.map(j => (
                    <motion.div key={j._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="job-item-card flex-column flex-sm-row">
                      <div className="job-item-left w-100">
                        <div className="company-icon-box flex-shrink-0">
                          {j.companyLogo ? <img src={j.companyLogo} alt="logo" /> : <Building2 size={20} className="text-muted" />}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <h6 className="fw-bold mb-0 text-truncate">{j.title}</h6>
                          <p className="company-text-small text-truncate">{j.companyName}</p>
                          <div className="job-item-meta">
                            <span><MapPin size={12} /> {j.location}</span>
                            <span><Briefcase size={12} /> {j.experience}</span>
                            <span><DollarSign size={12} /> {j.salary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="job-item-actions mt-3 mt-sm-0 w-sm-auto justify-content-end w-100">
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
        .admin-page-bg { background: #f4f7fe; min-height: 100vh; font-family: 'Inter', sans-serif; padding: 10px; }
        .admin-wrapper { max-width: 1200px; margin: 0 auto; padding: 20px 0; }
        .admin-nav { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .stats-badge { background: #fff; padding: 8px 16px; border-radius: 50px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; border: 1px solid #e0e6ed; width: fit-content; }
        .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

        .admin-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e0e6ed; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: visible !important; }
        .sticky-card { position: sticky; top: 20px; z-index: 10; }
        .card-label { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }

        .custom-select-wrapper { z-index: 100; }
        .custom-select-trigger {
          display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 10px 12px; border-radius: 12px; cursor: pointer; font-size: 13px; transition: all 0.3s ease;
        }
        .custom-select-trigger:hover, .custom-select-trigger.active { background: #fff; border-color: #000; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .custom-options-container {
          position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          max-height: 250px; overflow-y: auto; z-index: 9999;
        }

        .option-item {
          padding: 8px 10px; border-radius: 8px; font-size: 12px; font-weight: 500; color: #475569;
          cursor: pointer; display: flex; align-items: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .option-item:hover { color: #000; font-weight: 600; background: #f8fafc; }
        .option-item.selected { background: #f1f5f9; color: #000; font-weight: 700; }

        .custom-options-container::-webkit-scrollbar { width: 4px; }
        .custom-options-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        .form-group-custom { margin-bottom: 15px; }
        .form-group-custom label { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 6px; letter-spacing: 0.5px; }
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .input-with-icon input { padding-left: 35px !important; }

        .form-group-custom input, .form-group-custom textarea { 
          width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; 
          font-size: 14px; background: #f8fafc; outline: none; transition: 0.2s; color: #1e293b;
        }

        .btn-admin-primary { width: 100%; background: #000; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 14px; transition: 0.2s; }
        .btn-admin-primary:hover { background: #333; transform: translateY(-1px); }

        .job-item-card { background: #fff; border: 1px solid #e0e6ed; border-radius: 16px; padding: 18px 24px; margin-bottom: 15px; display: flex; align-items: center; gap: 15px; transition: 0.3s; }
        .job-item-card:hover { border-color: #000; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .job-item-left { display: flex; align-items: center; gap: 15px; min-width: 0; }
        .company-icon-box { width: 45px; height: 45px; background: #f8fafc; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #e2e8f0; }
        .company-icon-box img { width: 100%; height: 100%; object-fit: contain; }
        .job-item-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: #64748b; margin-top: 4px; }
        .job-item-meta span { display: flex; align-items: center; gap: 4px; white-space: nowrap; }
        .job-item-actions { display: flex; gap: 8px; }
        .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; display: flex; align-items: center; justify-content: center; transition: 0.2s; }

        @media (max-width: 768px) {
          .admin-page-bg { padding: 10px 5px; }
          .admin-card { padding: 16px; }
          .job-item-card { padding: 15px; }
          .sticky-card { position: static; margin-bottom: 20px; }
        }
      `}</style>
    </div>
  );
}

export default Admin;