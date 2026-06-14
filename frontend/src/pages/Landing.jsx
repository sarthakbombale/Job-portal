// pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Users, ChevronDown } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();

    const scrollToFeatures = () => {
        document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-white min-vh-100" style={{ fontFamily: "'Inter', sans-serif", color: "#111" }}>

            {/* ================= HERO FOLD (EXACTLY 100VH - NO INITIAL SCROLL) ================= */}
            <section className="d-flex flex-column min-vh-100 justify-content-between position-relative bg-light border-bottom">

                {/* TOP COMPACT NAVBAR */}
                <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-3">
                    <div className="container">
                        <a className="navbar-brand d-flex align-items-center gap-2" href="#" style={{ cursor: "default" }}>
                            <img
                                src="/job-genie.png"
                                alt="JobGine Logo"
                                style={{
                                    height: "3.5rem",
                                    maxHeight: "64px",
                                    width: "auto",
                                    objectFit: "contain"
                                }}
                            />
                        </a>
                        <div className="d-flex align-items-center gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="btn btn-link text-dark fw-bold text-decoration-none small text-uppercase tracking-wider p-0"
                                style={{ fontSize: "11px" }}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="btn btn-dark fw-bold text-uppercase px-4 py-2 rounded-pill shadow-sm"
                                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </nav>

                {/* HERO CORE CONTENT */}
                <div className="container my-auto py-4 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-xl-8">
                            <span
                                className="badge bg-dark text-white rounded-pill text-uppercase px-3 py-2 mb-3 tracking-widest fw-bold"
                                style={{ fontSize: "10px", letterSpacing: "1.5px" }}
                            >
                                Next-Gen Job Platform
                            </span>

                            <h1
                                className="display-4 fw-black text-dark text-uppercase mb-3 tracking-tighter"
                                style={{ fontWeight: 900, letterSpacing: "-2.5px", lineHeight: "1.05" }}
                            >
                                Your Dream Career <br />
                                <span className="text-muted opacity-75">Engineered Faster</span>
                            </h1>

                            <p
                                className="text-muted mb-4 mx-auto text-uppercase fw-semibold small tracking-wider"
                                style={{ maxWidth: "580px", fontSize: "12px", lineHeight: "1.6", letterSpacing: "1px" }}
                            >
                                Discover top tier tech opportunities, track workflows seamlessly, and land your ideal position with structural clarity.
                            </p>

                            <div className="d-flex justify-content-center gap-3 mb-5">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="btn btn-dark fw-bold text-uppercase px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2 shadow hero-cta-btn"
                                    style={{ fontSize: "12px", letterSpacing: "1px" }}
                                >
                                    Explore Opportunities <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PERSPECTIVE DASHBOARD PREVIEW MOCKUP */}
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-xl-8">
                            <div className="mockup-viewport bg-white p-2 rounded-4 shadow-lg border mx-auto">
                                <img
                                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
                                    alt="Application Dashboard Grid Mockup View"
                                    className="img-fluid rounded-3 border w-100 image-asset"
                                    style={{ height: "240px", objectFit: "cover", objectPosition: "top" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM INDICATOR */}
                <div className="text-center pb-3">
                    <button
                        onClick={scrollToFeatures}
                        className="btn btn-link text-muted text-decoration-none p-0 pulse-icon animate-bounce"
                        style={{ cursor: "pointer" }}
                    >
                        <span className="text-uppercase fw-bold small tracking-widest d-block mb-1" style={{ fontSize: "9px" }}>
                            Explore Features
                        </span>
                        <ChevronDown size={16} />
                    </button>
                </div>
            </section>

            {/* ================= SECONDARY CONTENT (SHOWS ONLY ON SCROLL) ================= */}
            <section id="features-section" className="py-5 bg-white target-scroll-fold">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-black text-uppercase tracking-tighter mb-2" style={{ fontWeight: 900, letterSpacing: "-1.5px" }}>
                            Built for Scale
                        </h2>
                        <p className="text-muted text-uppercase small fw-bold tracking-wider" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                            Everything you need to streamline tracking
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 bg-light text-center" style={{ borderRadius: "24px", border: "1px solid rgba(0,0,0,0.03)" }}>
                                <div className="d-inline-flex align-items-center justify-content-center bg-white border rounded-circle p-3 mb-4 mx-auto shadow-sm" style={{ width: "56px", height: "56px" }}>
                                    <Zap size={22} className="text-dark" />
                                </div>
                                <h5 className="fw-black text-uppercase mb-2" style={{ fontSize: "14px", letterSpacing: "-0.3px" }}>Instant Quick Apply</h5>
                                <p className="text-muted small mb-0" style={{ lineHeight: "1.5" }}>Submit curated operational profiles to engineering systems with a single reactive click hook trigger.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 bg-light text-center" style={{ borderRadius: "24px", border: "1px solid rgba(0,0,0,0.03)" }}>
                                <div className="d-inline-flex align-items-center justify-content-center bg-white border rounded-circle p-3 mb-4 mx-auto shadow-sm" style={{ width: "56px", height: "56px" }}>
                                    <ShieldCheck size={22} className="text-dark" />
                                </div>
                                <h5 className="fw-black text-uppercase mb-2" style={{ fontSize: "14px", letterSpacing: "-0.3px" }}>Protected Guard Routing</h5>
                                <p className="text-muted small mb-0" style={{ lineHeight: "1.5" }}>Role-based state isolation keeps user workflows separate from structural administrative panels security interfaces.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 bg-light text-center" style={{ borderRadius: "24px", border: "1px solid rgba(0,0,0,0.03)" }}>
                                <div className="d-inline-flex align-items-center justify-content-center bg-white border rounded-circle p-3 mb-4 mx-auto shadow-sm" style={{ width: "56px", height: "56px" }}>
                                    <Users size={22} className="text-dark" />
                                </div>
                                <h5 className="fw-black text-uppercase mb-2" style={{ fontSize: "14px", letterSpacing: "-0.3px" }}>Admin Applicant Track</h5>
                                <p className="text-muted small mb-0" style={{ lineHeight: "1.5" }}>Manage incoming applicants pipeline, view user details sheets, and oversee role scaling from a single view matrix dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-4 border-top bg-light text-center">
                <div className="container">
                    <p className="text-muted small fw-bold mb-0 text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                        &copy; {new Date().getFullYear()} JOBGINE SOFTWARE. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>

            {/* COMPACT CLEAN LANDING STYLES */}
            <style>{`
        .fw-black { font-weight: 900; }
        
        .mockup-viewport {
          max-width: 720px;
          transform: perspective(800px) rotateX(12deg);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.12), 0 18px 36px -18px rgba(0,0,0,0.15) !important;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .mockup-viewport:hover {
          transform: perspective(800px) rotateX(4deg) translateY(-3px);
        }

        .hero-cta-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -6px rgba(0,0,0,0.15) !important;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-bounce {
          animation: bounce 2s infinite ease-in-out;
        }

        .target-scroll-fold {
          scroll-margin-top: 40px;
        }
        
        .image-asset {
          filter: grayscale(10%) contrast(105%);
          opacity: 0.95;
        }
      `}</style>
        </div>
    );
}