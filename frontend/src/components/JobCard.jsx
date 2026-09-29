import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const JobCard = memo(function JobCard({ 
  job, 
  searchTerm, 
  onApply, 
  getRelativeTime, 
  token,
  loading 
}) {
  const navigate = useNavigate();

  // Memoize the click handler
  const handleCardClick = useCallback(() => {
    navigate(`/job/${job._id}`);
  }, [job._id, navigate]);

  // Memoize the apply handler
  const handleApply = useCallback((e) => {
    onApply(e, job._id);
  }, [job._id, onApply]);

  // Memoize skill filtering
  const displaySkills = React.useMemo(() => {
    return job.skills?.slice(0, 3) || [];
  }, [job.skills]);

  return (
    <motion.div
      className="col-md-6 col-xl-4"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="card border-0 p-4 h-100 shadow-sm"
        style={{
          borderRadius: "24px",
          cursor: "pointer",
          border: "1px solid #f0f0f0",
          transition: "all 0.2s ease"
        }}
        onClick={handleCardClick}
      >
        {/* Top row: relative time pill and applied badge */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span
            className="badge badge-light text-dark fw-bold"
            style={{ fontSize: "11px", letterSpacing: "0.5px" }}
          >
            {getRelativeTime(job.createdAt)}
          </span>
          {job.isApplied && (
            <CheckCircle2
              size={20}
              className="text-success"
              style={{ flexShrink: 0 }}
            />
          )}
        </div>

        {/* Job Title and Company with logo */}
        <div className="mb-3">
          <h5 className="fw-bold mb-2 text-dark" style={{ fontSize: "16px" }}>
            {job.title}
          </h5>
          <div className="d-flex align-items-center gap-2">
            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  objectFit: "cover"
                }}
              />
            )}
            <span className="text-muted small">{job.companyName}</span>
          </div>
        </div>

        {/* Skill Pills */}
        {displaySkills.length > 0 && (
          <div className="mb-3 d-flex gap-1 flex-wrap">
            {displaySkills.map((skill, idx) => (
              <span
                key={idx}
                className="badge bg-light text-dark small"
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  padding: "4px 8px"
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Salary and Experience Badges */}
        <div className="d-flex gap-2 mb-4">
          <div
            className="flex-fill px-3 py-2 rounded-3 text-center"
            style={{
              backgroundColor: "#f0f9ff",
              fontSize: "12px",
              fontWeight: "600",
              color: "#0369a1"
            }}
          >
            {job.salary}
          </div>
          <div
            className="flex-fill px-3 py-2 rounded-3 text-center"
            style={{
              backgroundColor: "#f0fdf4",
              fontSize: "12px",
              fontWeight: "600",
              color: "#16a34a"
            }}
          >
            {job.experience}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-auto d-flex align-items-center justify-content-between">
          <button
            className="btn btn-sm fw-bold"
            style={{
              backgroundColor: job.isApplied ? "#e5e7eb" : "#0f172a",
              color: job.isApplied ? "#6b7280" : "#ffffff",
              border: "none",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "12px",
              cursor: job.isApplied ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
            onClick={handleApply}
            disabled={job.isApplied || loading}
          >
            {job.isApplied ? "Applied" : "Apply Now"}
          </button>
          <ArrowRight size={18} className="text-muted" />
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.job._id === nextProps.job._id &&
    prevProps.job.isApplied === nextProps.job.isApplied &&
    prevProps.loading === nextProps.loading &&
    prevProps.searchTerm === nextProps.searchTerm
  );
});

export default JobCard;
