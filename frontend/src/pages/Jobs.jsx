import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // 1. Corrected Logout Logic
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.info("Logged Out");
  };

  // 2. Corrected Fetch Logic (Inside a function)
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs", {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load jobs");
    }
  };

  // 3. Apply Logic
  const apply = async (id) => {
    try {
      await API.post(`/apply/${id}`, {}, {
        headers: { Authorization: token }
      });
      toast.success("Applied Successfully ✅");
      fetchJobs(); // Refresh the list to show "Already Applied" status
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error applying");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "20px", color: "#000" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center border-bottom border-dark pb-2 mb-4">
          <h4 className="fw-bold m-0 text-uppercase">Welcome, {name}</h4>
          <button className="btn btn-dark btn-sm fw-bold" onClick={handleLogout} style={{ borderRadius: "0px" }}>
            Logout
          </button>
        </div>

        <h2 className="text-center mb-4 fw-bold text-uppercase">Available Jobs</h2>

        <div className="row">
          {jobs.length === 0 ? (
            <p className="text-center w-100">No jobs available right now.</p>
          ) : (
            jobs.map((job) => (
              <div className="col-md-4" key={job._id}>
                <div className="card mb-4 border-dark shadow-none" style={{ borderRadius: "0px" }}>
                  <div className="card-body">
                    <h5 className="fw-bold text-uppercase">{job.title}</h5>
                    <p className="small text-muted">{job.description}</p>
                    <p className="mb-3"><b>📍 {job.location}</b></p>

                    {/* 4. Logic for Button Text and State */}
                    <button
                      className={`btn w-100 fw-bold text-uppercase ${job.isApplied ? "btn-outline-secondary opacity-50" : "btn-dark"
                        }`}
                      onClick={() => !job.isApplied && apply(job._id)}
                      style={{
                        borderRadius: "0px",
                        cursor: job.isApplied ? "not-allowed" : "pointer",
                        pointerEvents: job.isApplied ? "auto" : "auto"
                      }}
                      title={job.isApplied ? "You have already applied for this position" : ""}
                      disabled={job.isApplied}
                    >
                      {job.isApplied ? "Already Applied" : "Apply Now"}
                    </button>
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