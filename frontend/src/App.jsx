import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
// Component Imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import MyApplications from "./pages/MyApplications";
import Applicants from "./pages/Applicants";

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
  const [searchTerm, setSearchTerm] = useState(""); // Lifted search state

  return (
    <BrowserRouter>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <ToastContainer position="top-right" autoClose={2000} theme="dark" />

        {/* Pass search state and setter to Navbar */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pass searchTerm to Jobs page */}
            <Route
              path="/jobs"
              element={<PrivateRoute><Jobs searchTerm={searchTerm} /></PrivateRoute>}
            />

            <Route path="/my-applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminRoute><Admin /></AdminRoute></PrivateRoute>} />
            <Route path="/admin/applicants/:jobId" element={<PrivateRoute><AdminRoute><Applicants /></AdminRoute></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;