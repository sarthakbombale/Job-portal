import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import { ArrowLeft, Building2, MapPin, IndianRupee, Briefcase } from "lucide-react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (isMounted) {
          setJob(res.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error("Could not load job details");
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!job) return <div className="text-center py-5">Loading Details...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px", fontFamily: "'Inter', sans-serif" }}>
      <button 
        className="btn btn-link text-dark p-0 mb-4 text-decoration-none d-flex align-items-center gap-2 fw-bold text-uppercase small" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back to listings
      </button>

      <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
        <h2 className="fw-bold text-uppercase mb-4" style={{ letterSpacing: '-1px' }}>{job.title}</h2>
        
        {/* DYNAMIC COMPANY & LOCATION SECTION */}
        <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
          <div 
            className="company-logo-detail shadow-sm border" 
            style={{ 
              width: '45px', 
              height: '45px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#fff', 
              borderRadius: '12px', 
              overflow: 'hidden'
            }}
          >
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }}
              />
            ) : (
              <Building2 size={24} className="text-muted opacity-50" />
            )}
          </div>
          <div>
            <div className="fw-bold text-dark text-uppercase small mb-1" style={{ letterSpacing: '0.5px' }}>
              {job.companyName || "GENERIC CORP"}
            </div>
            <div className="text-muted small d-flex align-items-center gap-1 fw-bold text-uppercase">
              <MapPin size={14} /> {job.location}
            </div>
          </div>
        </div>

        {/* INFO PILLS WITH ICONS */}
        <div className="d-flex flex-wrap gap-3 mb-5">
           <div className="d-flex align-items-center gap-2 bg-dark text-white px-3 py-2 rounded-3 small fw-bold">
             <IndianRupee size={14} /> {job.salary || "Not Disclosed"}
           </div>
           <div className="d-flex align-items-center gap-2 bg-light border px-3 py-2 rounded-3 small fw-bold text-dark text-uppercase">
             <Briefcase size={14} /> {job.experience || "0-1 Yrs"}
           </div>
        </div>

        <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
          Job Description
        </h6>
        <p className="text-secondary mb-5" style={{ lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
          {job.description}
        </p>

        <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
          Required Skills
        </h6>
        <div className="d-flex flex-wrap gap-2">
            {job.skills?.split(',').map((s, i) => (
                <span key={i} className="badge bg-light text-dark border rounded-pill px-3 py-2 text-uppercase" style={{ fontSize: '10px' }}>
                  {s.trim()}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;