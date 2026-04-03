import React, { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

function Jobs({ searchTerm }) {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs", { headers: { Authorization: token } });
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    }
  };

  const apply = async (id) => {
    try {
      await API.post(`/apply/${id}`, {}, { headers: { Authorization: token } });
      toast.success("Applied Successfully! 🚀");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error applying");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container pb-5">
      {/* Standard Style Tag (Removed the 'jsx' keyword to fix error) */}
      <style>
        {`
          .job-card {
            transition: all 0.2s ease-in-out;
            border: 2px solid #000 !important;
          }
          .job-card:hover {
            transform: translate(-4px, -4px);
            box-shadow: 8px 8px 0px 0px #000 !important;
          }
          .letter-spacing-2 { letter-spacing: 2px; }
        `}
      </style>

      <header className="mb-5">
        <h1 className="display-4 fw-bold text-uppercase letter-spacing-2">Opportunities</h1>
        <p className="text-muted text-uppercase small fw-bold">
          Logged in as <span className="text-dark">{name}</span> • {filteredJobs.length} Positions Available
        </p>
      </header>

      <div className="row g-4">
        {filteredJobs.length === 0 ? (
          <div className="col-12 text-center py-5 border border-dashed border-dark">
            <p className="text-muted text-uppercase fw-bold m-0">No matching roles found</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div className="col-lg-4 col-md-6" key={job._id}>
              <div className="card h-100 rounded-0 p-4 d-flex flex-column job-card">
                <div className="d-flex justify-content-between mb-3">
                  <span className="badge bg-white text-dark border border-dark rounded-0 px-2 py-1" style={{ fontSize: '10px' }}>
                    {job.location.toUpperCase()}
                  </span>
                  {job.isApplied && (
                    <span className="text-success small fw-bold">✓ SAVED</span>
                  )}
                </div>

                <h4 className="fw-bold text-uppercase mb-2">{job.title}</h4>
                <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.6' }}>
                  {job.description}
                </p>

                <button
                  className={`btn w-100 rounded-0 fw-bold text-uppercase mt-4 py-2 ${job.isApplied ? "btn-outline-secondary" : "btn-dark"
                    }`}
                  onClick={() => !job.isApplied && apply(job._id)}
                  style={{
                    fontSize: '12px',
                    letterSpacing: '1px',
                    // Forces the 'not-allowed' cursor even if the button is disabled
                    cursor: job.isApplied ? "not-allowed" : "pointer",
                    pointerEvents: "auto"
                  }}
                  disabled={job.isApplied}
                >
                  {job.isApplied ? "Already Applied" : "Quick Apply"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;