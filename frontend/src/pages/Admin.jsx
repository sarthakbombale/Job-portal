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
  CheckCircle2, SlidersHorizontal, ChevronLeft, ChevronRight
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Bounded view limit per matrix frame

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

      // Safety adjustment for pagination index when item drops off edge frame
      const updatedTotal = jobs.length - 1;
      const maxRemainingPages = Math.ceil(updatedTotal / itemsPerPage) || 1;
      if (currentPage > maxRemainingPages) {
        setCurrentPage(maxRemainingPages);
      }

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

  // Pagination Computing Logic
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / itemsPerPage) || 1;

  return (
    <div className="admin-page-bg">
      <div className="container-fluid admin-wrapper">
        <header className="admin-nav flex-column flex-md-row align-items-start align-items-md-center gap-2 mb-3">
          <div>
            <h3 className="m-0 fw-black tracking-tighter">ADMIN CONSOLE</h3>
            <p className="text-muted small mb-0">Managing listings for <strong>{name}</strong></p>
          </div>
          <div className="stats-badge shadow-sm">
            <span className="pulse-dot"></span>
            {jobs.length} Active Jobs
          </div>
        </header>

        <div className="row g-3">
          {/* LEFT SIDE FORM PANEL */}
          <aside className="col-12 col-lg-5">
            <div className="admin-card">
              <div className="card-label">
                {editingJobId ? <Edit3 size={14} /> : <Plus size={14} />}
                <span>{editingJobId ? "Edit Listing" : "Create Listing"}</span>
              </div>

              <form onSubmit={handleSubmit} className="mt-2">
                <div className="row g-2">
                  <div className="col-6 form-group-custom">
                    <label>Company Name</label>
                    <div className="input-with-icon">
                      <Building2 size={13} />
                      <input type="text" placeholder="e.g. TechCorp" value={job.companyName} onChange={e => setJob({ ...job, companyName: e.target.value })} required />
                    </div>
                  </div>

                  <div className="col-6 form-group-custom">
                    <label>Logo URL</label>
                    <div className="input-with-icon">
                      <LinkIcon size={13} />
                      <input type="text" placeholder="https://logo.png" value={job.companyLogo} onChange={e => setJob({ ...job, companyLogo: e.target.value })} />
                    </div>
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
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 3 }} exit={{ opacity: 0, y: -5 }}
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
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 3 }} exit={{ opacity: 0, y: -5 }}
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
                  <div className="custom-select-wrapper position-relative" style={{ zIndex: isLocationOpen ? 1001 : 1 }}>
                    <div
                      className={`custom-select-trigger ${isLocationOpen ? 'active' : ''}`}
                      onClick={() => { setIsLocationOpen(!isLocationOpen); setIsExpOpen(false); setIsSalaryOpen(false); }}
                    >
                      <MapPin size={13} className="text-muted" />
                      <span className={job.location ? "text-dark" : "text-muted"}>
                        {job.location || "Select City"}
                      </span>
                      <motion.div animate={{ rotate: isLocationOpen ? 180 : 0 }} className="ms-auto">
                        <SlidersHorizontal size={11} />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isLocationOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 3, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="custom-options-container"
                        >
                          {cityOptions.map((city) => (
                            <motion.div
                              key={city}
                              whileHover={{ x: 3, backgroundColor: "#f8fafc" }}
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
                    <Code size={13} />
                    <input type="text" placeholder="React, Node, MongoDB" value={job.skills} onChange={e => setJob({ ...job, skills: e.target.value })} />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Description</label>
                  <textarea rows="2" placeholder="Brief job summary..." value={job.description} onChange={e => setJob({ ...job, description: e.target.value })} required></textarea>
                </div>

                <button type="submit" className="btn-admin-primary mt-1 py-2 text-uppercase tracking-wider fw-bold">
                  {editingJobId ? "Update Posting" : "Publish Listing"}
                </button>
                {editingJobId && (
                  <button
                    type="button"
                    className="btn w-100 mt-2 fw-bold text-uppercase py-2 admin-cancel-btn"
                    style={{ fontSize: "11px", borderRadius: "8px", letterSpacing: "0.5px" }}
                    onClick={() => {
                      setEditingJobId(null);
                      setJob({ title: "", description: "", location: "", salary: "", experience: "", skills: "", companyName: "", companyLogo: "" });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </aside>

          {/* RIGHT SIDE DATA PANEL WITH PAGINATION */}
          <main className="col-12 col-lg-7 d-flex flex-column justify-content-start gap-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <h6 className="fw-black m-0 text-nowrap text-uppercase tracking-tight" style={{ fontSize: "13px" }}>Live Postings</h6>
                <div className="flex-grow-1 border-bottom"></div>
              </div>

              {loading ? (
                <div className="text-center p-5"><div className="spinner-border spinner-border-sm text-dark"></div></div>
              ) : (
                <div className="listings-stack">
                  {currentJobs.length === 0 ? (
                    <div className="text-center text-muted p-4 border rounded-3 bg-white small">No active vacancies posted yet.</div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {currentJobs.map((j, index) => {
                        // Safely evaluate unique fallback tracker key to handle incomplete database fields
                        const safeKey = j._id || j.id || `admin-job-idx-${index}`;
                        
                        return (
                          <motion.div
                            key={safeKey}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="job-item-card flex-row align-items-center justify-content-between"
                          >
                            <div className="job-item-left overflow-hidden me-2">
                              <div className="company-icon-box flex-shrink-0">
                                {j.companyLogo ? <img src={j.companyLogo} alt="logo" /> : <Building2 size={16} className="text-muted" />}
                              </div>
                              <div className="overflow-hidden">
                                <h6 className="fw-bold mb-0 text-truncate small-title-text">{j.title || "No Title Listed"}</h6>
                                <p className="company-text-small text-truncate mb-1">{j.companyName || "Unknown Company"}</p>
                                <div className="job-item-meta">
                                  <span><MapPin size={10} /> {j.location || "N/A"}</span>
                                  <span><Briefcase size={10} /> {j.experience || "N/A"}</span>
                                  <span><DollarSign size={10} /> {j.salary || "N/A"}</span>
                                </div>
                              </div>
                            </div>

                            <div className="job-item-actions flex-shrink-0">
                              <button className="btn-icon" onClick={() => navigate(`/admin/applicants/${j._id}`)} title="Applicants"><Users size={14} /></button>
                              <button className="btn-icon" onClick={() => { setJob(j); setEditingJobId(j._id); }} title="Edit"><Edit3 size={14} /></button>
                              <button className="btn-icon text-danger" onClick={() => executeDelete(j._id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>

            {/* INTEGRATED CLIENT-SIDE PAGINATION TRACKER */}
            {!loading && jobs.length > itemsPerPage && (
              <div className="d-flex align-items-center justify-content-between bg-white px-3 py-1.5 border rounded-3 shadow-sm component-pagination-bar">
                <span className="text-muted text-uppercase fw-bold" style={{ fontSize: "9px", letterSpacing: "0.5px", padding:"1rem" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-light border p-0 rounded d-flex align-items-center justify-content-center pagination-ctrl-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    className="btn btn-sm btn-light border p-0 rounded d-flex align-items-center justify-content-center pagination-ctrl-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .admin-page-bg { background: #f8fafc; min-height: calc(100vh - 56px); font-family: 'Inter', sans-serif; }
        .admin-wrapper { max-width: 1200px; margin: 0 auto; padding: 15px 10px; }
        .admin-nav { display: flex; justify-content: space-between; }
        .stats-badge { background: #fff; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 11px; display: flex; align-items: center; gap: 6px; border: 1px solid #e2e8f0; width: fit-content; }
        .pulse-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

        .admin-card { background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .card-label { display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 11px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }

        .custom-select-trigger {
          display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 12px; transition: all 0.2s ease;
        }
        .custom-select-trigger:hover, .custom-select-trigger.active { background: #fff; border-color: #000; }

        .custom-options-container {
          position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 4px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          max-height: 180px; overflow-y: auto; z-index: 9999;
        }

        .option-item {
          padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; color: #334155;
          cursor: pointer; display: flex; align-items: center; transition: all 0.15s ease;
        }
        .option-item:hover { color: #000; background: #f1f5f9; }
        .option-item.selected { background: #f1f5f9; color: #000; font-weight: 700; }

        .form-group-custom { margin-bottom: 10px; }
        .form-group-custom label { display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px; }
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; }
        .input-with-icon input { padding-left: 28px !important; }

        .form-group-custom input, .form-group-custom textarea { 
          width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 10px; 
          font-size: 13px; background: #f8fafc; outline: none; transition: 0.2s; color: #0f172a;
        }
        .form-group-custom input:focus, .form-group-custom textarea:focus { background: #fff; border-color: #000; }

        .btn-admin-primary { width: 100%; background: #000; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 700; font-size: 12px; transition: 0.2s; }
        .btn-admin-primary:hover { background: #222; }

        .job-item-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px; display: flex; gap: 12px; }
        .job-item-card:hover { border-color: #cbd5e1; }
        .job-item-left { display: flex; align-items: center; gap: 12px; }
        .company-icon-box { width: 36px; height: 36px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #e2e8f0; }
        .company-icon-box img { width: 100%; height: 100%; object-fit: contain; }
        
        .small-title-text { font-size: 13px; letter-spacing: -0.2px; }
        .company-text-small { font-size: 11px; color: #64748b; margin-bottom: 0px; }
        .job-item-meta { display: flex; gap: 8px; font-size: 10px; color: #64748b; }
        .job-item-meta span { display: flex; align-items: center; gap: 3px; }
        .job-item-actions { display: flex; gap: 4px; align-items: center; }
        .btn-icon { width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; display: flex; align-items: center; justify-content: center; transition: 0.15s; }
        .btn-icon:hover { border-color: #000; color: #000; }
        .btn-icon.text-danger:hover { border-color: #ef4444; color: #ef4444 !important; background: #fef2f2; }

        .admin-cancel-btn { background-color: transparent; color: #64748b; border: 1px solid #e2e8f0; transition: all 0.15s ease; }
        .admin-cancel-btn:hover { background-color: #000; border-color: #000; color: #fff; }

        @media (max-width: 991px) {
          .admin-wrapper { padding: 10px; }
        }
      `}</style>
    </div>
  );
}

export default Admin;