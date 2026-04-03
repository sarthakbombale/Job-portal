import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
  const [job, setJob] = useState({ title: "", description: "", location: "" });
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const createJob = async (e) => {
    e.preventDefault();
    if (!job.title || !job.description || !job.location) {
      toast.warning("All fields are required");
      return;
    }
    try {
      await API.post("/jobs", job, { headers: { Authorization: token } });
      toast.success("Job Posted Successfully");
      setJob({ title: "", description: "", location: "" });
      fetchJobs();
    } catch (err) {
      toast.error("Error creating job");
    }
  };

  const updateJob = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/jobs/${editingJobId}`, job, { headers: { Authorization: token } });
      toast.success("Job Updated");
      setEditingJobId(null);
      setJob({ title: "", description: "", location: "" });
      fetchJobs();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await API.delete(`/jobs/${id}`, { headers: { Authorization: token } });
        toast.dark("Job Deleted");
        fetchJobs();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const startEdit = (j) => {
    setJob({ title: j.title, description: j.description, location: j.location });
    setEditingJobId(j._id);
    window.scrollTo(0, 0);
  };

  // Logic to navigate to the new Applicants page
  const viewApplicants = (id) => {
    navigate(`/admin/applicants/${id}`);
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center border-bottom border-dark pb-2 mb-4">
          <h4 className="fw-bold m-0 text-uppercase">Admin: {name}</h4>
        </div>

        {/* Job Management Form */}
        <div className="card p-4 mb-5 border-dark shadow-none" style={{ borderRadius: "0px" }}>
          <h5 className="fw-bold text-uppercase border-bottom border-dark pb-2 mb-3">
            {editingJobId ? "Edit Job Posting" : "Create New Job"}
          </h5>
          <form onSubmit={editingJobId ? updateJob : createJob}>
            <input className="form-control border-dark mb-3 shadow-none rounded-0" placeholder="Job Title" value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} />
            <textarea className="form-control border-dark mb-3 shadow-none rounded-0" placeholder="Job Description" rows="3" value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} />
            <input className="form-control border-dark mb-3 shadow-none rounded-0" placeholder="Location" value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })} />
            <div className="d-flex gap-2">
              <button className="btn btn-dark w-100 fw-bold text-uppercase rounded-0">{editingJobId ? "Update Listing" : "Post Job"}</button>
              {editingJobId && <button type="button" className="btn btn-outline-danger rounded-0 fw-bold" onClick={() => {setEditingJobId(null); setJob({title:"", description:"", location:""})}}>CANCEL</button>}
            </div>
          </form>
        </div>

        {/* Active Listings Grid */}
        <h4 className="fw-bold text-uppercase mb-4">Active Listings</h4>
        <div className="row">
          {jobs.map((j) => (
            <div className="col-md-4 mb-4" key={j._id}>
              <div className="card h-100 border-dark shadow-none rounded-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-uppercase">{j.title}</h5>
                  <p className="small text-muted flex-grow-1">{j.description}</p>
                  <div className="mt-auto pt-3 border-top border-dark">
                    <p className="mb-3"><b>📍 {j.location}</b></p>
                    <div className="d-flex gap-1">
                      <button className="btn btn-outline-dark btn-sm fw-bold flex-fill rounded-0" onClick={() => viewApplicants(j._id)}>APPLICANTS</button>
                      <button className="btn btn-dark btn-sm fw-bold flex-fill rounded-0" onClick={() => startEdit(j)}>EDIT</button>
                      <button className="btn btn-outline-danger btn-sm fw-bold flex-fill rounded-0" onClick={() => deleteJob(j._id)}>DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;