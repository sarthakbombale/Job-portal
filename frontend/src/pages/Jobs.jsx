import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import { Search, CheckCircle2, Building2, Clock, ArrowRight, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

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
      console.errror(err);
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
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  const apply = async (e, id) => {
    e.stopPropagation();
    try {
      await API.post(`/apply/${id}`, {}, { headers: { Authorization: token } });
      toast.success("Application successful! 🚀");
      fetchJobs();
    } catch (err) { toast.error(err.response?.data?.msg || "Error applying"); }
  };

  const FilterContent = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-black text-uppercase m-0" style={{ fontSize: '12px', letterSpacing: '1px' }}>Filters</h6>
        <button className="btn btn-link text-muted p-0 small fw-bold text-decoration-none" style={{ fontSize: '10px' }}
          onClick={() => { setSelectedFilters({ location: [], experience: [], salary: [] }); setLocationQuery(""); setCurrentPage(1); }}>
          CLEAR ALL
        </button>
      </div>

      <div className="mb-4">
        <p className="fw-bold small text-uppercase text-muted mb-2" style={{ fontSize: '10px' }}>Location</p>
        <div className="position-relative mb-3">
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" size={14} />
          <input type="text" className="form-control form-control-sm ps-4 shadow-none border-light bg-light" placeholder="Search Location..."
            style={{ fontSize: '12px', borderRadius: '8px' }} value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
        </div>
        <div style={{ maxHeight: '150px', overflowY: 'auto' }} className="custom-scrollbar">
          {suggestedLocations.map(option => (
            <div className="form-check mb-2" key={option}>
              <input className="form-check-input shadow-none" type="checkbox" id={`loc-${option}`} checked={selectedFilters.location.includes(option)} onChange={() => handleFilterChange('location', option)} />
              <label className="form-check-label small fw-semibold text-dark" htmlFor={`loc-${option}`} style={{ cursor: 'pointer', fontSize: '13px' }}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {['experience', 'salary'].map((category) => (
        <div key={category} className="mb-4">
          <p className="fw-bold small text-uppercase text-muted mb-3" style={{ fontSize: '10px' }}>{category}</p>
          {filterOptions[category].map(option => (
            <div className="form-check mb-2" key={option}>
              <input className="form-check-input shadow-none" type="checkbox" id={`${category}-${option}`} checked={selectedFilters[category].includes(option)} onChange={() => handleFilterChange(category, option)} />
              <label className="form-check-label small fw-semibold text-dark" htmlFor={`${category}-${option}`} style={{ cursor: 'pointer', fontSize: '13px' }}>{option}</label>
            </div>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="container pb-5 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="mb-4 mb-md-5">
        <h1 className="display-6 fw-bold text-dark text-uppercase" style={{ letterSpacing: '-1.5px' }}>
          Explore <span className="text-muted">Opportunities</span>
        </h1>
        <p className="text-muted fw-bold small text-uppercase mb-0">
          {name} • {filteredJobs.length} roles available
        </p>
      </header>

      <div className="row g-4">
        <div className="col-lg-3 d-none d-lg-block">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: '24px', top: '110px', zIndex: 10, border: '1px solid #eee' }}>
            <FilterContent />
          </div>
        </div>

        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
          ) : (
            <>
              <div className="row g-3 g-md-4">
                <AnimatePresence mode='wait'>
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job) => (
                      <div className="col-md-6 col-xl-4" key={job._id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => navigate(`/job/${job._id}`)}
                          className="card border-0 p-4 job-card-main standard-shadow h-100"
                          style={{ cursor: 'pointer', borderRadius: '24px' }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2 px-2 py-1 bg-light rounded-pill border" style={{ fontSize: '10px' }}>
                              <Clock size={12} className="text-muted" />
                              <span className="fw-bold text-dark text-uppercase">{getRelativeTime(job.createdAt)}</span>
                            </div>
                            {job.isApplied && <CheckCircle2 size={20} className="text-success" />}
                          </div>
                          <div className="mb-3">
                            <h5 className="fw-black text-dark mb-1 text-uppercase" style={{ fontSize: '1rem' }}>{job.title}</h5>
                            <div className="d-flex align-items-center gap-2 text-primary small fw-bold">
                              <span className="text-uppercase">{job.companyName}</span>
                            </div>
                          </div>
                          <div className="mb-3 d-flex flex-wrap gap-1">
                            {job.skills?.split(',').slice(0, 3).map((s, i) => (
                              <span key={i} className="skill-pill">{s.trim()}</span>
                            ))}
                          </div>
                          <div className="d-flex gap-2 mb-4">
                              <div className="flex-fill p-2 bg-primary text-white rounded-3 text-center">
                                <div className="fw-bold" style={{ fontSize: '10px' }}>{job.salary}</div>
                              </div>
                              <div className="flex-fill p-2 border border-dark rounded-3 text-center">
                                <div className="fw-bold text-dark" style={{ fontSize: '10px' }}>{job.experience}</div>
                              </div>
                          </div>
                          <div className="mt-auto d-flex align-items-center justify-content-between">
                            {/* Updated Button Logic below */}
                            <button className={`btn fw-bold text-uppercase px-4 py-2 rounded-pill ${
                                job.isApplied 
                                ? "btn-success border-success text-white disabled-green" 
                                : "btn-dark"
                              }`} 
                              disabled={job.isApplied} 
                              onClick={(e) => apply(e, job._id)} 
                              style={{ fontSize: '13px' }}>
                              {job.isApplied ? "Applied" : "Quick Apply"}
                            </button>
                            <ArrowRight size={18} className="text-muted" />
                          </div>
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5 w-100">
                      <p className="text-muted fw-bold text-uppercase">No matches found.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                  <button className="btn btn-light rounded-circle p-2 shadow-sm border" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)} className={`btn rounded-circle fw-bold shadow-sm border ${currentPage === i + 1 ? 'btn-dark' : 'btn-light'}`} style={{ width: '40px', height: '40px', fontSize: '12px' }}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="btn btn-light rounded-circle p-2 shadow-sm border" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter sections remain same */}
      <div className="d-lg-none position-fixed" style={{ bottom: '85px', right: '20px', zIndex: 1060 }}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowMobileFilters(true)} className="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
          <SlidersHorizontal size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilters(false)} className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="position-fixed bottom-0 start-0 w-100 bg-white p-4" style={{ zIndex: 2001, borderTopLeftRadius: '30px', borderTopRightRadius: '30px', maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-black m-0">REFINE SEARCH</h5>
                <button className="btn btn-light rounded-circle p-2" onClick={() => setShowMobileFilters(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterContent />
              <button className="btn btn-dark w-100 py-3 mt-3 fw-bold rounded-pill" onClick={() => setShowMobileFilters(false)}>
                SHOW {filteredJobs.length} RESULTS
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .job-card-main { transition: all 0.3s ease; border: 1px solid #eee !important; }
        .job-card-main:hover { transform: translateY(-5px); border-color: #000 !important; }
        .skill-pill { background: #f1f1f1; color: #444; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
        .fw-black { font-weight: 900; }
        .form-check-input:checked { background-color: #000; border-color: #000; }
        
        /* Custom styling for Applied Green button */
        .disabled-green {
          background-color: #47b749 !important;
          border-color: #47b749 !important;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Jobs;