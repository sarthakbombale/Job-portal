import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import { Search, CheckCircle2, Building2, Clock, ArrowRight, SlidersHorizontal, X, ChevronLeft, ChevronRight, Briefcase, MapPin } from "lucide-react";
import JobCardSkeleton from "../components/JobCardSkeleton";

function Jobs({ searchTerm }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationQuery, setLocationQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    experience: [],
    salary: []
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const filterOptions = {
    location: ["Pune", "Mumbai", "Bangalore", "Delhi", "Remote", "Hyderabad", "Chennai", "Gurgaon"],
    experience: ["Freshers", "1-3 Years", "3-5 Years", "5+ Years"],
    salary: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10+ LPA"]
  };

  const suggestedLocations = useMemo(() => {
    return filterOptions.location.filter(loc =>
      loc.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [locationQuery, filterOptions.location]);

  const handleFilterChange = (category, value) => {
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
  };

  const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs", { headers: { Authorization: token } });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = (j.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = selectedFilters.location.length === 0 || selectedFilters.location.includes(j.location);
    const matchesExperience = selectedFilters.experience.length === 0 || selectedFilters.experience.includes(j.experience);
    const matchesSalary = selectedFilters.salary.length === 0 || selectedFilters.salary.includes(j.salary);

    return matchesSearch && matchesLocation && matchesExperience && matchesSalary;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRelativeTime = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "RECENTLY";

    const diff = Math.floor((new Date() - parsedDate) / 1000);
    if (diff < 60) return "JUST NOW";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return parsedDate.toLocaleDateString('en-IN');
  };

  const apply = async (e, id) => {
    e.stopPropagation();
    try {
      await API.post(`/apply/${id}`, {}, { headers: { Authorization: token } });
      toast.success("Application successful! 🚀");
      fetchJobs();
    } catch (err) { toast.error(err.response?.data?.msg || "Error applying"); }
  };

  const activeFilterCount = selectedFilters.location.length + selectedFilters.experience.length + selectedFilters.salary.length;

  const FilterContent = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-black text-uppercase m-0" style={{ fontSize: '12px', letterSpacing: '1.5px', color: '#0F172A' }}>
          Filters {activeFilterCount > 0 && <span style={{ color: '#2563EB' }}>({activeFilterCount})</span>}
        </h6>
        <button className="btn btn-link text-muted p-0 small fw-bold text-decoration-none" style={{ fontSize: '10px', letterSpacing: '0.5px' }}
          onClick={() => { setSelectedFilters({ location: [], experience: [], salary: [] }); setLocationQuery(""); setCurrentPage(1); }}>
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
  );

  return (
    <div className="container pb-5 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="mb-4 mb-md-5 pb-3" style={{ borderBottom: '1px solid #EEF0F3' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '34px', height: '34px', background: '#0F172A' }}>
            <Briefcase size={17} color="#fff" />
          </div>
          <span className="fw-bold text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '2px' }}>Careers Hub</span>
        </div>
        <h1 className="display-6 fw-bold text-dark" style={{ letterSpacing: '-1.2px' }}>
          Explore <span style={{ color: '#2563EB' }}>opportunities</span>
        </h1>
        <p className="text-muted fw-semibold small mb-0 d-flex align-items-center gap-2">
          <span>Welcome back, {name}</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
          <span>{filteredJobs.length} roles available</span>
        </p>
      </header>

      <div className="row g-4">
        <div className="col-lg-3 d-none d-lg-block">
          <div className="card border-0 p-4 sticky-top" style={{ borderRadius: '20px', top: '110px', zIndex: 10, border: '1px solid #ECEFF3', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' }}>
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
                        <div className="col-md-6 col-xl-4" key={uniqueKey}>
                          <motion.div
                            key={uniqueKey}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                              const jobId = job._id || job.id;
                              if (!jobId) { console.warn('Job id missing, ignoring click.'); return; }
                              navigate(`/job/${jobId}`);
                            }}
                            className="card border-0 p-4 job-card-main standard-shadow h-100"
                            style={{ cursor: 'pointer', borderRadius: '20px' }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill" style={{ fontSize: '10px', background: '#F1F5F9' }}>
                                <Clock size={12} style={{ color: '#64748B' }} />
                                <span className="fw-bold text-uppercase" style={{ color: '#475569', letterSpacing: '0.3px' }}>
                                  {job.createdAt ? getRelativeTime(job.createdAt) : "JUST NOW"}
                                </span>
                              </div>
                              {job.isApplied && <CheckCircle2 size={20} style={{ color: '#16A34A' }} />}
                            </div>

                            <div className="mb-4 d-flex align-items-center gap-3">
                              <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #EEF0F3' }}>
                                {job.companyLogo ? (
                                  <img src={job.companyLogo} alt="logo" style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} />
                                ) : (
                                  <Building2 size={26} style={{ color: '#94A3B8' }} />
                                )}
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="fw-black text-dark mb-1" style={{ fontSize: '1rem', lineHeight: '1.25' }}>{job.title}</h5>
                                <div className="d-flex align-items-center gap-1 fw-semibold small" style={{ color: '#2563EB' }}>
                                  <span>{job.companyName}</span>
                                </div>
                              </div>
                            </div>

                            {job.location && (
                              <div className="d-flex align-items-center gap-1 mb-3 text-muted small fw-semibold">
                                <MapPin size={13} />
                                <span>{job.location}</span>
                              </div>
                            )}

                            <div className="mb-3 d-flex flex-wrap gap-1">
                              {job.skills?.split(',').slice(0, 3).map((s, i) => (
                                <span key={i} className="skill-pill">{s.trim()}</span>
                              ))}
                            </div>

                            <div className="d-flex gap-2 mb-4">
                              <div className="flex-fill p-2 rounded-3 text-center" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)' }}>
                                <div className="fw-bold text-white" style={{ fontSize: '11px' }}>{job.salary}</div>
                              </div>
                              <div className="flex-fill p-2 rounded-3 text-center" style={{ border: '1.5px solid #E2E8F0' }}>
                                <div className="fw-bold" style={{ fontSize: '11px', color: '#334155' }}>{job.experience}</div>
                              </div>
                            </div>

                            <div className="mt-auto d-flex align-items-center justify-content-between">
                              <button className={`btn fw-bold text-uppercase px-4 py-2 rounded-pill ${job.isApplied
                                ? "btn-success border-success text-white disabled-green"
                                : "btn-dark"
                                }`}
                                disabled={job.isApplied}
                                onClick={(e) => apply(e, job._id || job.id)}
                                style={{ fontSize: '12.5px', letterSpacing: '0.3px' }}>
                                {job.isApplied ? "Applied" : "Quick Apply"}
                              </button>
                              <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', background: '#F1F5F9' }}>
                                <ArrowRight size={16} style={{ color: '#334155' }} />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-5 w-100">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: '#F1F5F9' }}>
                        <Search size={22} style={{ color: '#94A3B8' }} />
                      </div>
                      <p className="text-muted fw-bold text-uppercase mb-0" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>No matches found</p>
                      <p className="text-muted small mb-0">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                  <button className="btn btn-light rounded-circle p-2 border" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} style={{ boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)} className={`btn rounded-circle fw-bold border ${currentPage === i + 1 ? 'btn-dark' : 'btn-light'}`} style={{ width: '40px', height: '40px', fontSize: '12px', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="btn btn-light rounded-circle p-2 border" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} style={{ boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="d-lg-none position-fixed" style={{ bottom: '85px', right: '20px', zIndex: 1060 }}>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setShowMobileFilters(true)} className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center position-relative" style={{ width: '56px', height: '56px', boxShadow: '0 8px 20px rgba(15,23,42,0.25)' }}>
          <SlidersHorizontal size={22} />
          {activeFilterCount > 0 && (
            <span className="position-absolute d-flex align-items-center justify-content-center fw-bold" style={{ top: '-2px', right: '-2px', width: '20px', height: '20px', background: '#2563EB', color: '#fff', borderRadius: '50%', fontSize: '10px', border: '2px solid #fff' }}>
              {activeFilterCount}
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilters(false)} className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(15,23,42,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="position-fixed bottom-0 start-0 w-100 bg-white p-4" style={{ zIndex: 2001, borderTopLeftRadius: '26px', borderTopRightRadius: '26px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-center mb-3">
                <div style={{ width: '40px', height: '4px', borderRadius: '4px', background: '#E2E8F0' }} />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-black m-0" style={{ color: '#0F172A' }}>Refine search</h5>
                <button className="btn btn-light rounded-circle p-2 border-0" onClick={() => setShowMobileFilters(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterContent />
              <button className="btn btn-dark w-100 py-3 mt-3 fw-bold rounded-pill" onClick={() => setShowMobileFilters(false)} style={{ letterSpacing: '0.3px' }}>
                SHOW {filteredJobs.length} RESULTS
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .job-card-main { transition: all 0.25s ease; border: 1px solid #EEF0F3 !important; background: #ffffff; }
        .job-card-main:hover { transform: translateY(-4px); border-color: #0F172A !important; box-shadow: 0 14px 30px rgba(15, 23, 42, 0.09) !important; }
        .standard-shadow { box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05); }
        .skill-pill { background: #F1F5F9; color: #334155; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
        .fw-black { font-weight: 900; }
        .form-check-input:checked { background-color: #2563EB; border-color: #2563EB; }
        .form-check-input:focus { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); border-color: #2563EB; }
        .btn-dark { background-color: #0F172A; border-color: #0F172A; }
        .btn-dark:hover { background-color: #1E293B; border-color: #1E293B; }
        .form-control:focus { border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important; }

        /* Custom styling for Applied Green button */
        .disabled-green {
          background-color: #16A34A !important;
          border-color: #16A34A !important;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Jobs;
