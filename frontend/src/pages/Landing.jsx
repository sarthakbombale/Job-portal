// pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
  Sparkles,
  BriefcaseBusiness,
  TrendingUp,
  Clock3,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <Zap size={20} />,
      title: "Fast applications",
      text: "Apply to curated opportunities with a quicker, cleaner workflow.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Secure access",
      text: "Role-based protection keeps candidates and admins in the right place.",
    },
    {
      icon: <Users size={20} />,
      title: "Simple tracking",
      text: "Monitor every application from a single dashboard with minimal effort.",
    },
  ];

  const steps = [
    {
      icon: <BriefcaseBusiness size={18} />,
      title: "Browse openings",
      text: "Discover roles aligned with your experience and ambitions.",
    },
    {
      icon: <Clock3 size={18} />,
      title: "Track progress",
      text: "Keep the status of each application clear and up to date.",
    },
    {
      icon: <TrendingUp size={18} />,
      title: "Grow faster",
      text: "Move from applying to interviewing with confidence and momentum.",
    },
  ];

  return (
    <div className="landing-shell" style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a" }}>
      <section className="hero-section">
        <nav className="navbar navbar-expand-lg py-3">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center gap-2" href="#" style={{ cursor: "default" }}>
              <img
                src="/job-genie.png"
                alt="JobGine Logo"
                style={{ height: "3.3rem", width: "auto", objectFit: "contain" }}
              />
            </a>
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="btn btn-link text-dark fw-semibold text-decoration-none small text-uppercase p-0"
                style={{ fontSize: "11px", letterSpacing: "0.8px" }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn btn-dark fw-semibold text-uppercase px-4 py-2 rounded-pill shadow-sm"
                style={{ fontSize: "11px", letterSpacing: "0.8px" }}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <div className="container py-4 py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="badge-pill d-inline-flex align-items-center gap-2 mb-3">
                <Sparkles size={14} />
                <span>Updated experience for modern hiring</span>
              </div>
              <h1 className="hero-title mb-3">
                Discover jobs that fit your future.
              </h1>
              <p className="hero-copy mb-4">
                Explore curated opportunities, manage applications with ease, and move from interest to interview faster.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-dark fw-semibold px-4 py-3 rounded-pill d-inline-flex align-items-center gap-2 hero-cta"
                >
                  Create Account <ArrowRight size={16} />
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="btn btn-outline-dark fw-semibold px-4 py-3 rounded-pill"
                >
                  See platform features
                </button>
              </div>
              <div className="hero-stats d-flex flex-wrap gap-3">
                <div>
                  <strong>100+</strong>
                  <span>active roles</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>application visibility</span>
                </div>
                <div>
                  <strong>4.9/5</strong>
                  <span>user satisfaction</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-card">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Teams reviewing candidates and opportunities"
                />
                <div className="hero-card-overlay">
                  <div className="mini-card">
                    <p>New this week</p>
                    <h4>Senior Product Designer</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features-section" className="features-section">
        <div className="container py-5">
          <div className="text-center mb-5">
            <p className="section-label">Built for candidates and teams</p>
            <h2 className="section-title">Everything you need to keep momentum</h2>
            <p className="section-copy">
              A simple experience that supports discovery, application flow, and a clearer hiring process.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {features.map((feature, index) => (
              <div className="col-md-4" key={index}>
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h5>{feature.title}</h5>
                  <p>{feature.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <div className="steps-card">
                <p className="section-label">How it works</p>
                <h3>From first look to final follow-up</h3>
                <ul>
                  {steps.map((step, index) => (
                    <li key={index}>
                      <span className="step-icon">{step.icon}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="quote-card">
                <p>“JobGine gives you a clearer path to opportunities that matter, while helping teams stay organized and efficient.”</p>
                <div className="quote-author">
                  <strong>Ready to launch your next move?</strong>
                  <button onClick={() => navigate("/register")} className="btn btn-dark rounded-pill px-4 py-2 mt-3">
                    Join now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span>© {new Date().getFullYear()} JobGine</span>
          <span>Smart hiring, simplified.</span>
        </div>
      </footer>

      <style>{`
        .landing-shell {
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
        }

        .hero-section {
          min-height: 100vh;
          background: radial-gradient(circle at top left, rgba(13, 110, 253, 0.10), transparent 28%), #f8fbff;
        }

        .badge-pill {
          background: #111827;
          color: #fff;
          padding: 0.55rem 0.9rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: clamp(2.2rem, 4vw, 3.8rem);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .hero-copy {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #475569;
          max-width: 620px;
        }

        .hero-cta {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.25);
        }

        .hero-stats {
          margin-top: 1rem;
        }

        .hero-stats div {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 0.8rem 1rem;
          display: flex;
          flex-direction: column;
          min-width: 120px;
        }

        .hero-stats strong {
          font-size: 1.05rem;
          color: #111827;
        }

        .hero-stats span {
          font-size: 0.8rem;
          color: #64748b;
        }

        .hero-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 22px 50px -20px rgba(15, 23, 42, 0.28);
          background: #fff;
        }

        .hero-card img {
          width: 100%;
          height: 440px;
          object-fit: cover;
          display: block;
        }

        .hero-card-overlay {
          position: absolute;
          inset: auto 1rem 1rem 1rem;
        }

        .mini-card {
          background: rgba(255,255,255,0.92);
          padding: 1rem 1.1rem;
          border-radius: 16px;
          backdrop-filter: blur(8px);
        }

        .mini-card p {
          margin: 0 0 0.25rem;
          font-size: 0.8rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .mini-card h4 {
          margin: 0;
          color: #0f172a;
          font-size: 1rem;
          font-weight: 700;
        }

        .features-section {
          padding: 3rem 0 4rem;
          background: #ffffff;
        }

        .section-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 0.75rem;
        }

        .section-title {
          font-size: clamp(1.7rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.6rem;
        }

        .section-copy {
          max-width: 700px;
          margin: 0 auto;
          color: #64748b;
          line-height: 1.7;
        }

        .feature-card,
        .steps-card,
        .quote-card {
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          padding: 1.4rem;
          background: #f8fbff;
          box-shadow: 0 10px 30px -20px rgba(15, 23, 42, 0.2);
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff;
          color: #2563eb;
          margin-bottom: 0.9rem;
        }

        .feature-card h5 {
          font-weight: 700;
          margin-bottom: 0.45rem;
          color: #0f172a;
        }

        .feature-card p {
          margin: 0;
          color: #64748b;
          line-height: 1.65;
        }

        .steps-card h3 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .steps-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .steps-card li {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
          margin-bottom: 0.95rem;
        }

        .step-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e8f1ff;
          color: #2563eb;
        }

        .steps-card strong {
          display: block;
          margin-bottom: 0.2rem;
          color: #0f172a;
        }

        .steps-card p {
          margin: 0;
          color: #64748b;
          font-size: 0.95rem;
        }

        .quote-card {
          background: linear-gradient(135deg, #111827 0%, #1e293b 100%);
          color: #fff;
        }

        .quote-card p {
          font-size: 1.15rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .quote-author strong {
          display: block;
          font-size: 1rem;
        }

        .footer {
          padding: 1.25rem 0;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          background: #fff;
          color: #64748b;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}