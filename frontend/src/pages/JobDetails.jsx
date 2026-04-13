import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
/* eslint-enable no-unused-vars */
import { 
  ArrowLeft, Building2, MapPin, IndianRupee, 
  Briefcase, CheckCircle2, Calendar 
} from "lucide-react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setJob(null);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJob(res.data);
      } catch (err) {
        console.error(err);
        const status = err.response?.status;
        if (status === 404) {
          toast.error("Job not found.");
        } else {
          toast.error("Could not load job details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const apply = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/apply/${id}`, {}, { headers: { Authorization: token } });
      toast.success("Application successful! 🚀");
      setJob(prev => ({ ...prev, isApplied: true }));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error applying");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-dark" role="status"></div>
    </div>
  );

  if (!job) return <div className="text-center py-5">Job not found.</div>;

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: "1000px", fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navigation */}
      <div className="mb-4">
        <button 
          className="btn btn-outline-dark keep-black-hover border-0 bg-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-bold text-uppercase small" 
          onClick={() => navigate("/jobs")}
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>
      </div>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm p-4 p-md-5 rounded-5"
          >
            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="bg-white border rounded-4 p-2 shadow-sm" style={{ width: '64px', height: '64px' }}>
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt="logo" className="w-100 h-100 object-fit-contain" />
                ) : (
                  <Building2 size={40} className="text-muted opacity-25" />
                )}
              </div>
              <div>
                <h1 className="fw-black text-uppercase h3 mb-1" style={{ letterSpacing: '-1px' }}>{job.title}</h1>
                <p className="text-primary fw-bold text-uppercase small mb-0">{job.companyName}</p>
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            <section className="mb-5">
              <h6 className="fw-black text-uppercase text-muted mb-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                Job Description
              </h6>
              <div className="text-dark" style={{ lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '1rem', color: '#334155' }}>
                {job.description}
              </div>
            </section>

            <section>
              <h6 className="fw-black text-uppercase text-muted mb-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                Technical Stack
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {job.skills?.split(',').map((s, i) => (
                  <span key={i} className="badge bg-white text-dark border rounded-3 px-3 py-2 text-uppercase fw-bold" style={{ fontSize: '11px' }}>
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
            <div className="card border-0 shadow-sm p-4 rounded-5 mb-3">
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

              <button 
                onClick={apply}
                disabled={job.isApplied}
                className={`btn w-100 py-3 rounded-pill fw-black text-uppercase shadow-sm ${
                  job.isApplied ? "btn-light text-success border" : "btn-dark"
                }`}
                style={{ fontSize: '12px' }}
              >
                {job.isApplied ? (
                  <><CheckCircle2 size={16} className="me-2" /> Application Sent</>
                ) : (
                  "Apply"
                )}
              </button>
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
        .fw-black { font-weight: 900; }
        .card { border: 1px solid #f1f5f9 !important; }
        body { background-color: #f8fafc; }
        .btn-dark:hover { background-color: #000; transform: translateY(-2px); transition: all 0.2s; }
        .keep-black-hover:hover,
        .keep-black-hover:focus {
          color: #000 !important;
          background-color: #f8fafc !important;
          border-color: #000 !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}

export default JobDetails;