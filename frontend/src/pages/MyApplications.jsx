import React, { useEffect, useState } from "react";
import API from "../api";

function MyApplications() {
  const [apps, setApps] = useState([]);

useEffect(() => {
  const fetchMyApps = async () => {
    try {
      // Use the new endpoint we just created
      const res = await API.get("/user-applications", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setApps(res.data);
    } catch (err) {
      console.error("Error fetching applications");
    }
  };
  fetchMyApps();
}, []);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-uppercase border-bottom border-dark pb-2 mb-4">My Applications</h2>
      {apps.length === 0 ? (
        <p className="text-muted text-center mt-5">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="row">
          {apps.map((app) => (
            <div className="col-md-6 mb-3" key={app._id}>
              <div className="card border-dark shadow-none" style={{ borderRadius: "0px" }}>
                <div className="card-body">
                  <h5 className="fw-bold">{app.jobId?.title}</h5>
                  <p className="mb-1 text-muted">{app.jobId?.company}</p>
                  <span className="badge bg-dark text-uppercase" style={{ fontSize: "10px" }}>
                    Status: {app.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;