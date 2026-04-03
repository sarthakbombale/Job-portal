import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs", {
        headers: { Authorization: token }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load jobs");
    }
  };

  const apply = async (id) => {
    try {
      await API.post(`/apply/${id}`, {}, {
        headers: { Authorization: token }
      });
      toast.success("Applied Successfully ✅");
      fetchJobs(); 
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error applying");
    }
  };

  useEffect(() => {
    if (!token) navigate("/"); // Guard clause if token is missing
    fetchJobs();
  }, []);

  // Filter logic: Checks title, company, or location
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "20px", color: "#000" }}>
      <div className="container">
        
        {/* Welcome Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h4 className="fw-bold m-0 text-uppercase letter-spacing-1">Welcome back, {name}</h4>
            <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>Finding the best opportunities for you</small>
          </div>
          {/* Profile shortcut */}
          <button 
            className="btn btn-outline-dark btn-sm fw-bold text-uppercase" 
            style={{ borderRadius: "0px", fontSize: '11px' }}
            onClick={() => navigate("/my-applications")}
          >
            My Applications
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="mb-5">
          <input 
            type="text" 
            className="form-control border-dark shadow-none p-3" 
            placeholder="Search by Job Title, Company, or Location..." 
            style={{ borderRadius: "0px", borderRight: 'none', borderLeft: 'none', borderTop: 'none' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="mb-4 fw-bold text-uppercase letter-spacing-2 text-center">Available Roles</h2>

        <div className="row">
          {filteredJobs.length === 0 ? (
            <div className="text-center w-100 py-5">
              <p className="text-muted text-uppercase small">No matching jobs found.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div className="col-md-4 mb-4" key={job._id}>
                <div className="card h-100 border-dark shadow-none" style={{ borderRadius: "0px" }}>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                       <h5 className="fw-bold text-uppercase m-0">{job.title}</h5>
                       <span className="badge bg-dark rounded-0" style={{ fontSize: '9px' }}>NEW</span>
                    </div>
                    <p className="small text-muted mb-3" style={{ flexGrow: 1 }}>{job.description}</p>
                    <div className="border-top border-dark pt-3 mt-2">
                        <p className="mb-3 small"><b>📍 {job.location.toUpperCase()}</b></p>
                        <button
                          className={`btn w-100 fw-bold text-uppercase py-2 ${job.isApplied ? "btn-outline-secondary" : "btn-dark"}`}
                          onClick={() => !job.isApplied && apply(job._id)}
                          style={{
                            borderRadius: "0px",
                            cursor: job.isApplied ? "not-allowed" : "pointer",
                            fontSize: '12px'
                          }}
                          disabled={job.isApplied}
                        >
                          {job.isApplied ? "Already Applied" : "Apply Now"}
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;