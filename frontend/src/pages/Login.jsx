import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId);

      toast.success("Login Successful");
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <div className="card p-5 border-0 shadow-lg" 
           style={{ width: "420px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.95)" }}>
        
        <div className="text-center mb-5">
          <h2 className="fw-black text-dark text-uppercase mb-1" style={{ letterSpacing: "3px" }}>Login</h2>
          <div style={{ height: "3px", width: "40px", backgroundColor: "#000", margin: "10px auto" }}></div>
          <p className="text-muted small text-uppercase fw-bold">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label x-small fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "0.7rem" }}>Email Address</label>
            <input
              type="email"
              className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none"
              placeholder="name@gmail.com"
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
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{ transition: "0.3s" }}
            />
          </div>

          <button type="submit" 
                  className="btn btn-dark w-100 fw-bold text-uppercase py-3 shadow-sm mb-4" 
                  style={{ borderRadius: "4px", letterSpacing: "2px", transition: "all 0.3s" }}>
            Login
          </button>
        </form>

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