import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/register", form);
      toast.success("Account Created Successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.error || "Registration Error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <div className="card p-4 border-0 shadow-lg" 
           style={{ width: "400px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.95)" }}>
        
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark text-uppercase mb-1" style={{ letterSpacing: "2px" }}>Register</h3>
          <div style={{ height: "2px", width: "30px", backgroundColor: "#000", margin: "8px auto" }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary text-uppercase mb-0" style={{ fontSize: "0.65rem" }}>Full Name</label>
            <input 
              className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none" 
              placeholder="John Doe" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required
              style={{ fontSize: "0.9rem", paddingY: "5px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-secondary text-uppercase mb-0" style={{ fontSize: "0.65rem" }}>Email Address</label>
            <input 
              type="email"
              className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none" 
              placeholder="name@gmail.com" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              required
              style={{ fontSize: "0.9rem", paddingY: "5px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary text-uppercase mb-0" style={{ fontSize: "0.65rem" }}>Password</label>
            <input 
              type="password" 
              className="form-control border-0 border-bottom border-dark rounded-0 px-0 bg-transparent shadow-none" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              required
              style={{ fontSize: "0.9rem", paddingY: "5px" }}
            />
          </div>

          <button type="submit" 
                  className="btn btn-dark w-100 fw-bold text-uppercase py-2 shadow-sm mb-3" 
                  style={{ borderRadius: "4px", letterSpacing: "1px", fontSize: "0.9rem" }}>
            Create Account
          </button>
        </form>

        <div className="text-center">
          <span className="text-muted small">Already a member? </span>
          <Link to="/" className="text-dark fw-bold text-decoration-none small text-uppercase" 
                style={{ borderBottom: "1px solid #000" }}>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;