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
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="card p-4 shadow-none border border-dark" style={{ width: "350px", borderRadius: "0px" }}>
        <h2 className="text-center mb-4 fw-bold text-uppercase">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control border-dark shadow-none" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ borderRadius: "0px" }} />
          </div>
          <div className="mb-3">
            <input className="form-control border-dark shadow-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ borderRadius: "0px" }} />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control border-dark shadow-none" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ borderRadius: "0px" }} />
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold text-uppercase" style={{ borderRadius: "0px" }}>
            Register
          </button>
        </form>
        <p className="text-center mt-3 small">
          Already have an account? <Link to="/" className="text-dark fw-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;