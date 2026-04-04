import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";

// Component Imports
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import MyApplications from "./pages/MyApplications";
import Applicants from "./pages/Applicants";
import JobDetails from "./pages/JobDetails"; // Ensure this file exists in your pages folder

// Authentication Guards
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/jobs" />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Pages */}
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                  <Jobs searchTerm={searchTerm} />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* ADDED: Individual Job Details Route */}
          <Route
            path="/job/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <JobDetails />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <PrivateRoute>
                <Layout>
                  <MyApplications />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Protected ADMIN Pages */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout>
                  <Admin />
                </Layout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/applicants/:jobId"
            element={
              <AdminRoute>
                <Layout>
                  <Applicants />
                </Layout>
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
      />
    </>
  );
}

export default App;