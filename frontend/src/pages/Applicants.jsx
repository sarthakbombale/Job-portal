import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";

function Applicants() {
  const { jobId } = useParams(); // Get jobId from URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applicants/${jobId}`, {
          headers: { Authorization: token },
        });
        setApplicants(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch applicants");
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId, token]);

  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center border-bottom border-dark pb-3 mb-4">
        <h2 className="fw-bold text-uppercase m-0">Applicant Records</h2>
        <button className="btn btn-dark fw-bold btn-sm" onClick={() => navigate("/admin")}>
          BACK TO DASHBOARD
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-5">Loading records...</p>
      ) : applicants.length === 0 ? (
        <div className="text-center mt-5 py-5 border border-dark border-dashed">
          <p className="text-muted text-uppercase fw-bold">No applications received for this position yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover border-dark">
            <thead className="table-dark">
              <tr>
                <th className="text-uppercase small">Candidate Name</th>
                <th className="text-uppercase small">Email Address</th>
                <th className="text-uppercase small">Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td className="fw-bold">{app.userId?.name || "N/A"}</td>
                  <td>{app.userId?.email || "N/A"}</td>
                  <td className="small text-muted">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Applicants;