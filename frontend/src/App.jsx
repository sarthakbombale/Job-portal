import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import './index.css';

// Component Imports
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import MyApplications from "./pages/MyApplications";
import Applicants from "./pages/Applicants";
import JobDetails from "./pages/JobDetails";

// Fallback Page Imports
import { NotFoundPage, NetworkErrorPage } from "./components/Fallbacks";

// Authentication Guards
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    // Redirect unauthenticated users to login instead of landing page
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }
  return role === "admin" ? children : <Navigate to="/jobs" replace />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false); // Tracks server drops

  useEffect(() => {
    // Listen for the custom global event thrown by the API interceptor
    const handleNetworkFailure = () => setHasNetworkError(true);
    window.addEventListener("apiNetworkError", handleNetworkFailure);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("apiNetworkError", handleNetworkFailure);
    };
  }, []);

  const handleRetryConnection = () => {
    setHasNetworkError(false);
    window.location.reload(); // Hard fresh to attempt reloading structural state data
  };

  // If api server is unmounted completely, drop everything else and display fallback
  if (hasNetworkError) {
    return <NetworkErrorPage onRetry={handleRetryConnection} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public SaaS Hub */}
          <Route path="/" element={<Landing />} />
          
          {/* Public Auth Pages */}
          <Route path="/login" element={<Login />} />
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

          {/* 404 FALLBACK ROUTE - Catches everything else entered dynamically */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
        stacked 
        limit={3} 
      />
    </>
  );
}

export default App;