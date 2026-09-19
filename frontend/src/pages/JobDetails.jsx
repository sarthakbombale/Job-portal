import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */
import { 
  ArrowLeft, Building2, MapPin, IndianRupee, 
  Briefcase, CheckCircle2, Calendar, Sparkles, Clock3, BadgeCheck
} from "lucide-react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id || id === 'undefined' || id === 'null') {
        setJob(null);
        setLoading(false);
        // Invalid id: silently return user to listings instead of showing a popup
        navigate('/jobs');
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJob(res.data);
      } catch (err) {
        console.error("Failed fetching job details:", {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });

        const status = err.response?.status;
        if (status === 404) {
          toast.error("Job not found.");
        } else if (status === 401 || status === 403) {
          toast.error("Unauthorized. Please login again.");
        } else {
          toast.error(`Could not load job details (${status || 'network error'}).`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const apply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!id || id === 'undefined' || id === 'null') return;

      const form = new FormData();
      if (resumeFile) form.append('resume', resumeFile);

      await API.post(`/apply/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Application successful! 🚀");
      setJob(prev => ({ ...prev, isApplied: true }));
      setResumeFile(null);
      setResumePreview(null);
    } catch (err) {
      console.error('Apply failed', { url: err.config?.url, data: err.response?.data, status: err.response?.status, message: err.message });
      toast.error(err.response?.data?.msg || `Error applying (${err.response?.status || 'network'})`);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setResumeFile(null);
    setResumeFile(f);
    setResumePreview(f.name);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-dark" role="status"></div>
    </div>
  );

  if (!job) return <div className="text-center py-5">Job not found.</div>;

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: "1120px", fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navigation */}
      <div className="mb-4">
        <button 
          className="btn btn-outline-dark keep-black-hover border-0 bg-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-bold text-uppercase small" 
          onClick={() => navigate("/jobs")}
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>
      </div>

      {/* Job Hero Section */}
      <div className="job-hero-card mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="company-badge">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt="logo" className="w-100 h-100 object-fit-contain" />
              ) : (
                <Building2 size={30} className="text-muted opacity-25" />
              )}
            </div>
            <div>
              <div className="badge-pill"><Sparkles size={12} /> Top opportunity</div>
              <h1 className="job-title mb-1">{job.title}</h1>
              <p className="job-company mb-0">{job.companyName}</p>
            </div>
          </div>

          <div className="job-meta-group">
            <div className="meta-box">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="meta-box">
              <Briefcase size={16} />
              <span>{job.experience}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="content-card"
          >
            <section className="mb-5">
              <h6 className="section-eyebrow mb-3">Job Description</h6>
              <div className="job-description">
                {job.description}
              </div>
            </section>

            <section>
              <h6 className="section-eyebrow mb-3">Required Skills</h6>
              <div className="d-flex flex-wrap gap-2">
                {job.skills?.split(',').map((s, i) => (
                  <span key={i} className="skill-pill-detail">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </section>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky-top" style={{ top: '100px' }}
          >
            <div className="sidebar-card mb-3">
              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-light rounded-3 text-dark"><MapPin size={18} /></div>
                  <div>
                    <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>LOCATION</div>
                    <div className="fw-bold">{job.location}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-light rounded-3 text-dark"><IndianRupee size={18} /></div>
                  <div>
                    <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>ANNUAL SALARY</div>
                    <div className="fw-bold">{job.salary}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-light rounded-3 text-dark"><Briefcase size={18} /></div>
                  <div>
                    <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>EXPERIENCE</div>
                    <div className="fw-bold">{job.experience}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-light rounded-3 text-dark"><Calendar size={18} /></div>
                  <div>
                    <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>POSTED ON</div>
                    <div className="fw-bold">{new Date(job.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Apply Section */}
              {!job.isApplied && (
                <>
                  <div className="mb-3">
                    <label className="form-label small text-uppercase fw-bold">Upload Resume (optional)</label>
                    <input type="file" accept=".pdf,.doc,.docx" className="form-control" onChange={onFileChange} />
                    {resumePreview && <div className="small text-muted mt-2">Selected: {resumePreview}</div>}
                  </div>
                  <button 
                    onClick={apply}
                    className="btn w-100 py-3 rounded-pill fw-black text-uppercase shadow-sm btn-dark"
                    style={{ fontSize: '12px' }}
                  >
                    Apply now
                  </button>
                </>
              )}

              {job.isApplied && (
                <button className="btn w-100 py-3 rounded-pill fw-black text-uppercase shadow-sm btn-light text-success border border-success" disabled>
                  <CheckCircle2 size={16} className="me-2" /> Application Sent
                </button>
              )}
            </div>

            {/* Missing Skills Warning */}
            {job.missingSkills?.length > 0 && (
              <div className="p-4 rounded-5 bg-white border shadow-sm">
                 <p className="fw-black mb-3 text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>MISSING FROM YOUR PROFILE:</p>
                 <div className="d-flex flex-wrap gap-2">
                    {job.missingSkills.map(s => (
                      <span key={s} className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-3" style={{ fontSize: '10px' }}>{s}</span>
                    ))}
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .job-hero-card {
          background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
          border-radius: 28px;
          padding: 1.5rem 1.75rem;
          box-shadow: 0 24px 40px rgba(37, 99, 235, 0.18);
        }

        .company-badge {
          width: 74px;
          height: 74px;
          border-radius: 22px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          color: #e2e8f0;
          padding: 0.38rem 0.75rem;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .job-title {
          font-size: clamp(1.8rem, 2vw + 1rem, 2.8rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 1.05;
          color: #fff;
        }

        .job-company {
          color: rgba(255,255,255,0.74);
          font-size: 0.92rem;
          font-weight: 600;
        }

        .job-meta-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .meta-box {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 0.9rem;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          color: #eff6ff;
          border: 1px solid rgba(255,255,255,0.12);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .content-card,
        .sidebar-card {
          border: 1px solid #f1f5f9 !important;
          border-radius: 26px;
          background: #ffffff;
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.05);
        }

        .content-card {
          padding: 2rem;
        }

        .sidebar-card {
          padding: 1.5rem;
        }

        .section-eyebrow {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 900;
          margin: 0;
        }

        .job-description {
          line-height: 1.9;
          white-space: pre-line;
          color: #334155;
          font-size: 1rem;
        }

        .skill-pill-detail {
          background: rgba(37,99,235,0.08);
          color: #1d4ed8;
          border: 1px solid rgba(37,99,235,0.12);
          padding: 0.55rem 0.8rem;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .fw-black { font-weight: 900; }
        .btn-dark:hover { background-color: #000; transform: translateY(-2px); transition: all 0.2s; }
        .keep-black-hover:hover,
        .keep-black-hover:focus {
          color: #000 !important;
          background-color: #f8fafc !important;
          border-color: #000 !important;
          box-shadow: none !important;
        }

        @media (max-width: 767px) {
          .job-hero-card {
            padding: 1.25rem;
          }

          .job-meta-group {
            justify-content: flex-start;
          }

          .content-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default JobDetails;