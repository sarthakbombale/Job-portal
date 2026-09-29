import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import { Search, CheckCircle2, Building2, Clock, ArrowRight, SlidersHorizontal, X, ChevronLeft, ChevronRight, Briefcase, MapPin, TrendingUp, Sparkles } from "lucide-react";
import JobCardSkeleton from "../components/JobCardSkeleton";
import JobCard from "../components/JobCard";
import { useJobs, useApplyJob } from "../hooks/useAPI";

function Jobs({ searchTerm }) {
  const [locationQuery, setLocationQuery] = React.useState("");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedFilters, setSelectedFilters] = React.useState({
    location: [],
    experience: [],
    salary: []
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const jobsPerPage = 6;

  // Use React Query hook for data fetching with caching
  const { data: jobs = [], isLoading: loading, refetch } = useJobs(token);
  const applyMutation = useApplyJob();

  const filterOptions = useMemo(() => ({
    location: ["Pune", "Mumbai", "Bangalore", "Delhi", "Remote", "Hyderabad", "Chennai", "Gurgaon"],
    experience: ["Freshers", "1-3 Years", "3-5 Years", "5+ Years"],
    salary: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10+ LPA"]
  }), []);

  // Memoize suggested locations
  const suggestedLocations = useMemo(() => {
    return filterOptions.location.filter(loc =>
      loc.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [locationQuery, filterOptions.location]);

  // Memoize filter change handler
  const handleFilterChange = useCallback((category, value) => {
    setSelectedFilters(prev => {
      const isAlreadySelected = prev[category].includes(value);
      setCurrentPage(1);
      return {
        ...prev,
        [category]: isAlreadySelected
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      };
    });
  }, []);

  // Memoize filter clearing
  const clearFilters = useCallback(() => {
    setSelectedFilters({ location: [], experience: [], salary: [] });
    setLocationQuery("");
    setCurrentPage(1);
  }, []);

  // Memoize filtered jobs computation
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = (j.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = selectedFilters.location.length === 0 || selectedFilters.location.includes(j.location);
      const matchesExperience = selectedFilters.experience.length === 0 || selectedFilters.experience.includes(j.experience);
      const matchesSalary = selectedFilters.salary.length === 0 || selectedFilters.salary.includes(j.salary);

      return matchesSearch && matchesLocation && matchesExperience && matchesSalary;
    });
  }, [jobs, searchTerm, selectedFilters]);

  // Memoize pagination computation
  const { totalPages, indexOfFirstJob, indexOfLastJob, currentJobs } = useMemo(() => {
    const total = Math.ceil(filteredJobs.length / jobsPerPage);
    const last = currentPage * jobsPerPage;
    const first = last - jobsPerPage;
    const current = filteredJobs.slice(first, last);
    return { totalPages: total, indexOfFirstJob: first, indexOfLastJob: last, currentJobs: current };
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Memoize pagination handler
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoize relative time function
  const getRelativeTime = useCallback((date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "RECENTLY";

    const diff = Math.floor((new Date() - parsedDate) / 1000);
    if (diff < 60) return "JUST NOW";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return parsedDate.toLocaleDateString('en-IN');
  }, []);

  // Memoize apply handler
  const handleApply = useCallback(async (e, id) => {
    e.stopPropagation();
    try {
      await applyMutation.mutateAsync({ jobId: id, token, formData: {} });
      toast.success("Application successful! 🚀");
      refetch(); // Refetch jobs to update applied status
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error applying");
    }
  }, [applyMutation, token, refetch]);

  // Memoize active filter count
  const activeFilterCount = useMemo(() =>
    selectedFilters.location.length + selectedFilters.experience.length + selectedFilters.salary.length,
    [selectedFilters]
  );

  const filterHighlights = useMemo(() => [
    { label: 'Top roles', value: `${jobs.length}+` },
    { label: 'Remote ready', value: '52%' },
    { label: 'Avg. response', value: '2 days' }
  ], [jobs.length]);

  const FilterContent = useCallback(() => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-black text-uppercase m-0" style={{ fontSize: '12px', letterSpacing: '1.5px', color: '#0F172A' }}>
          Filters {activeFilterCount > 0 && <span style={{ color: '#2563EB' }}>({activeFilterCount})</span>}
        </h6>
        <button className="btn btn-link text-muted p-0 small fw-bold text-decoration-none" style={{ fontSize: '10px', letterSpacing: '0.5px' }}
          onClick={clearFilters}>
          CLEAR ALL
        </button>
      </div>

      <div className="mb-4">
        <p className="fw-bold small text-uppercase text-muted mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>Location</p>
        <div className="position-relative mb-3">
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={14} />
          <input type="text" className="form-control form-control-sm ps-5 shadow-none border-light bg-light" placeholder="Search location..."
            style={{ fontSize: '13px', borderRadius: '10px', height: '38px', border: '1px solid #E2E8F0' }} value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
        </div>
        <div style={{ maxHeight: '150px', overflowY: 'auto' }} className="custom-scrollbar">
          {suggestedLocations.map(option => (
            <div className="form-check mb-2" key={option}>
              <input className="form-check-input shadow-none" type="checkbox" id={`loc-${option}`} checked={selectedFilters.location.includes(option)} onChange={() => handleFilterChange('location', option)} />
              <label className="form-check-label small fw-semibold text-dark" htmlFor={`loc-${option}`} style={{ cursor: 'pointer', fontSize: '13.5px' }}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {['experience', 'salary'].map((category) => (
        <div key={category} className="mb-4">
          <p className="fw-bold small text-uppercase text-muted mb-3" style={{ fontSize: '10px', letterSpacing: '1px' }}>{category}</p>
          {filterOptions[category].map(option => (
            <div className="form-check mb-2" key={option}>
              <input className="form-check-input shadow-none" type="checkbox" id={`${category}-${option}`} checked={selectedFilters[category].includes(option)} onChange={() => handleFilterChange(category, option)} />
              <label className="form-check-label small fw-semibold text-dark" htmlFor={`${category}-${option}`} style={{ cursor: 'pointer', fontSize: '13.5px' }}>{option}</label>
            </div>
          ))}
        </div>
      ))}
    </>
  ), [selectedFilters, activeFilterCount, clearFilters, handleFilterChange, suggestedLocations, filterOptions, locationQuery]);

  return (
    <div className="container pb-5 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="job-portal-header mb-4 mb-md-5">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #0f172a, #1d4ed8)' }}>
                <Briefcase size={18} color="#fff" />
              </div>
              <span className="fw-bold text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '2px' }}>Careers Hub</span>
            </div>
            <h1 className="display-6 fw-black mb-2" style={{ letterSpacing: '-1.2px', lineHeight: 1.05 }}>
              Discover your <span style={{ color: '#2563EB' }}>next role</span>
            </h1>
            <p className="text-muted fw-semibold mb-0 d-flex align-items-center gap-2 flex-wrap">
              <span>Welcome back, {name}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
              <span>{filteredJobs.length} roles available</span>
            </p>
          </div>

          <div className="d-flex gap-3 flex-wrap justify-content-lg-end">
            {filterHighlights.map((item) => (
              <div key={item.label} className="mini-stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {['Fast Hiring', 'Remote Friendly', 'High Growth', 'Product Roles', 'UX Design', 'Data & AI'].map((tag) => (
            <span key={tag} className="header-chip">
              <Sparkles size={12} />
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="row g-4">
        <div className="col-lg-3 d-none d-lg-block">
          <div className="card border-0 p-4 sticky-top" style={{ borderRadius: '22px', top: '110px', zIndex: 10, border: '1px solid #ECEFF3', boxShadow: '0 18px 35px rgba(15, 23, 42, 0.05)', background: '#fff' }}>
            <FilterContent />
          </div>
        </div>

        <div className="col-lg-9">
          {loading ? (
            <div className="row g-3 g-md-4">
              {[...Array(6)].map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="row g-3 g-md-4">
                <AnimatePresence mode='popLayout'>
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job, index) => {
                      const uniqueKey = (job._id && job._id.trim() !== "") ? job._id : (job.id || `job-idx-${index}`);
                      return (
                        <JobCard
                          key={uniqueKey}
                          job={job}
                          searchTerm={searchTerm}
                          onApply={handleApply}
                          getRelativeTime={getRelativeTime}
                          token={token}
                          loading={loading}
                        />
                      );
                    })
                  ) : (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted fw-semibold">No jobs match your criteria</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-circle"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`btn btn-sm rounded-circle ${currentPage === page ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => paginate(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-circle"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
