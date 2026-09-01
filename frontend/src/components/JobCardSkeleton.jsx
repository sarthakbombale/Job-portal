import React from "react";

export function JobCardSkeleton() {
  return (
    <div className="col-md-6 col-xl-4">
      <div className="card border-0 p-4 h-100 skeleton-card" style={{ borderRadius: '24px', border: '1px solid #eee' }}>
        {/* Top row: relative time pill and applied badge placeholder */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="skeleton-line rounded-pill" style={{ width: '80px', height: '20px' }}></div>
          <div className="skeleton-line rounded-circle" style={{ width: '20px', height: '20px' }}></div>
        </div>

        {/* Job Title and Company */}
        <div className="mb-3">
          <div className="skeleton-line mb-2 rounded" style={{ width: '75%', height: '1.25rem' }}></div>
          <div className="skeleton-line rounded" style={{ width: '40%', height: '0.9rem' }}></div>
        </div>

        {/* Skill Pills */}
        <div className="mb-3 d-flex gap-1">
          <div className="skeleton-line rounded" style={{ width: '50px', height: '18px' }}></div>
          <div className="skeleton-line rounded" style={{ width: '65px', height: '18px' }}></div>
          <div className="skeleton-line rounded" style={{ width: '55px', height: '18px' }}></div>
        </div>

        {/* Salary and Experience Badges */}
        <div className="d-flex gap-2 mb-4">
          <div className="flex-fill skeleton-line rounded-3" style={{ height: '32px' }}></div>
          <div className="flex-fill skeleton-line rounded-3" style={{ height: '32px' }}></div>
        </div>

        {/* Footer Button and Arrow Icon */}
        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="skeleton-line rounded-pill" style={{ width: '100px', height: '32px' }}></div>
          <div className="skeleton-line rounded" style={{ width: '18px', height: '18px' }}></div>
        </div>
      </div>
      
      {/* Scope the animation styles tightly to this component */}
      <style>{`
        .skeleton-card {
          background: #ffffff;
          pointer-events: none;
        }
        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeletonPulse 1.5s infinite ease-in-out;
        }
        @keyframes skeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default JobCardSkeleton;