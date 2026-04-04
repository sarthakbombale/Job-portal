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
  let isMounted = true; // Track if component is still active

  const fetchJob = async () => {
    if (!id) return; // Guard: Don't fetch if ID is missing

    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/jobs/${id}`, {
        headers: { Authorization: token }
      });
      
      if (isMounted) {
        setJob(res.data);
      }
    } catch (err) {
      // Only show error if the component is still mounted
      if (isMounted) {
        console.error(err);
        toast.error("Could not load job details");
      }
    }
  };

  fetchJob();

  return () => {
    isMounted = false; // Cleanup: Stop updates when user leaves the page
  };
}, [id]);

  if (!job) return <div className="text-center py-5">Loading Details...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <button className="btn btn-link text-dark p-0 mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="me-2" /> Back to listings
      </button>

      <div className="card border-0 shadow-sm p-5 rounded-4">
        <h2 className="fw-bold text-uppercase mb-3">{job.title}</h2>
        <div className="d-flex gap-4 mb-4 text-muted small fw-bold text-uppercase">
          <span className="d-flex align-items-center gap-1"><Building2 size={16}/> Scalefull Tech</span>
          <span className="d-flex align-items-center gap-1"><MapPin size={16}/> {job.location}</span>
        </div>

        <div className="d-flex gap-3 mb-5">
           <div className="bg-light px-3 py-2 rounded-2 small fw-bold">💰 {job.salary}</div>
           <div className="bg-light px-3 py-2 rounded-2 small fw-bold">💼 {job.experience}</div>
        </div>

        <h5 className="fw-bold mb-3">Job Description</h5>
        <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>{job.description}</p>

        <h5 className="fw-bold mt-4 mb-3">Required Skills</h5>
        <div className="d-flex flex-wrap gap-2">
            {job.skills?.split(',').map((s, i) => (
                <span key={i} className="badge bg-dark rounded-pill px-3 py-2">{s.trim()}</span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;