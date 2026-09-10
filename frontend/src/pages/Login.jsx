import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      setLoading(true);
      const res = await API.post("/request-otp", form);
      toast.success(res.data.msg || "OTP sent to your email");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/verify-otp", {
        email: form.email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId);

      toast.success(res.data.msg || "Login Successful");
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === "login") {
      await requestOtp();
      return;
    }

    await verifyOtpAndLogin(e);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <div className="card p-5 border-0 shadow-lg" 
           style={{ width: "420px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.95)" }}>
        
        <div className="text-center mb-5">
          <h2 className="fw-black text-dark text-uppercase mb-1" style={{ letterSpacing: "3px" }}>
            {step === "login" ? "Login" : "Verify OTP"}
          </h2>
          <div style={{ height: "3px", width: "40px", backgroundColor: "#000", margin: "10px auto" }}></div>
          <p className="text-muted small text-uppercase fw-bold">
            {step === "login" ? "Sign in to your account" : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === "login" ? (
            <>
              <div className="mb-4">
                <label className="form-label x-small fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "0.7rem" }}>Email Address</label>
                <input
                  type="email"
                  className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none"
                  placeholder="name@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ transition: "0.3s" }}
                />
              </div>
              
              <div className="mb-5">
                <label className="form-label x-small fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "0.7rem" }}>Password</label>
                <input
                  type="password"
                  className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ transition: "0.3s" }}
                />
              </div>
            </>
          ) : (
            <div className="mb-5">
              <label className="form-label x-small fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "0.7rem" }}>OTP Code</label>
              <input
                type="text"
                className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
                style={{ transition: "0.3s" }}
              />
            </div>
          )}

          <button type="submit" 
                  className="btn btn-dark w-100 fw-bold text-uppercase py-3 shadow-sm mb-4" 
                  style={{ borderRadius: "4px", letterSpacing: "2px", transition: "all 0.3s" }}
                  disabled={loading}>
            {loading ? (step === "login" ? "Sending OTP..." : "Verifying...") : (step === "login" ? "Send OTP" : "Verify & Login")}
          </button>
        </form>

        {step === "otp" && (
          <div className="text-center mb-3">
            <button
              type="button"
              className="btn btn-link text-dark fw-bold text-decoration-none small text-uppercase"
              onClick={() => setStep("login")}
            >
              Change Email / Password
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-muted small mb-0">Don't have an account?</p>
          <Link to="/register" className="text-dark fw-bold text-decoration-none small text-uppercase" 
                style={{ borderBottom: "2px solid #000" }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;