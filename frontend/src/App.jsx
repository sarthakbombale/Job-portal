import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
// Component Imports
import Layout from "./components/Layout";
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
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        {/* Pages WITHOUT Navbar/Footer (Login & Register) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages WITH Navbar/Footer (Wrapped in Layout) */}
        <Route
          path="/jobs"
          element={
            <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
              <Jobs searchTerm={searchTerm} />
            </Layout>
          }
        />

        <Route
          path="/my-applications"
          element={
            <Layout>
              <MyApplications />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;