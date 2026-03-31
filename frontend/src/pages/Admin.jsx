import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
  const [job, setJob] = useState({ title: "", description: "", location: "" });
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.info("Logged Out");
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
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
      toast.success("Job Posted");
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
    if (window.confirm("Do you really want to delete this job?")) {
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

  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applicants/${jobId}`, { headers: { Authorization: token } });
      setApplicants(res.data);
      toast.info(`Found ${res.data.length} applicants`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#000", padding: "20px" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center border-bottom border-dark pb-2 mb-4">
          <h4 className="fw-bold m-0 text-uppercase">Admin: {name}</h4>
          <button className="btn btn-outline-dark btn-sm fw-bold" onClick={handleLogout}>LOGOUT</button>
        </div>

        <div className="card p-4 mb-5 border-dark shadow-none" style={{ borderRadius: "10px" }}>
          <div className="d-flex justify-content-between">
            <h5 className="fw-bold text-uppercase">{editingJobId ? "Edit Listing" : "New Job Listing"}</h5>
            {editingJobId && <button className="btn btn-sm text-danger fw-bold" onClick={() => {setEditingJobId(null); setJob({title:"", description:"", location:""})}}>CANCEL</button>}
          </div>
          <form onSubmit={editingJobId ? updateJob : createJob} className="mt-3">
            <input className="form-control border-dark mb-3 shadow-none" placeholder="Title" value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} style={{ borderRadius: "5px" }} />
            <textarea className="form-control border-dark mb-3 shadow-none" placeholder="Description" rows="4" value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} style={{ borderRadius: "5px", resize: "vertical" }} />
            <input className="form-control border-dark mb-3 shadow-none" placeholder="Location" value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })} style={{ borderRadius: "5px" }} />
            <button className="btn btn-dark w-100 fw-bold text-uppercase" style={{ borderRadius: "5px" }}>{editingJobId ? "Update Job" : "Post Job"}</button>
          </form>
        </div>

        <h4 className="fw-bold text-uppercase mb-3">Live Listings</h4>
        <div className="row">
          {jobs.map((j) => (
            <div className="col-md-4" key={j._id}>
              <div className="card mb-3 border-dark shadow-none" style={{ borderRadius: "5px" }}>
                <div className="card-body">
                  <h5 className="fw-bold">{j.title}</h5>
                  <p className="small">{j.description}</p>
                  <p className="mb-3"><b>{j.location}</b></p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-dark btn-sm fw-bold w-100" onClick={() => viewApplicants(j._id)}>APPLICANTS</button>
                    <button className="btn btn-dark btn-sm fw-bold w-100" onClick={() => startEdit(j)}>EDIT</button>
                    <button className="btn btn-outline-danger btn-sm fw-bold w-100" onClick={() => deleteJob(j._id)}>DELETE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="mt-5 fw-bold text-uppercase">Applicant Records</h4>
        <div className="card p-3 border-dark shadow-none" style={{ borderRadius: "10px" }}>
          {applicants.length === 0 ? <p className="text-muted">Select a job to see applicants.</p> : applicants.map((a) => (
            <div key={a._id} className="border-bottom border-dark py-2">
              <p className="m-0"><b>Name:</b> {a.userId?.name}</p>
              <p className="m-0"><b>Email:</b> {a.userId?.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;