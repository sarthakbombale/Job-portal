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
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="card p-4 shadow-none border border-dark" style={{ width: "350px", borderRadius: "0px" }}>
        <h2 className="text-center mb-4 fw-bold text-uppercase">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control border-dark shadow-none"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ borderRadius: "0px" }}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control border-dark shadow-none"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ borderRadius: "0px" }}
            />
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold text-uppercase" style={{ borderRadius: "0px" }}>
            Login
          </button>
        </form>
        <p className="text-center mt-3 small">
          Don't have an account? <Link to="/register" className="text-dark fw-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;