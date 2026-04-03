import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  return (
    <BrowserRouter>
      {/* Wrapper to push footer to bottom */}
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        
        <ToastContainer position="top-right" autoClose={2000} theme="dark" />
        <Navbar />

        {/* Main content area grows to fill space */}
        <main className="flex-grow-1">
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User/Candidate Routes */}
            <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
            <Route path="/my-applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />

            {/* Admin Specific Routes */}
            <Route path="/admin" element={<PrivateRoute><AdminRoute><Admin /></AdminRoute></PrivateRoute>} />
            
            {/* Dynamic Route for viewing applicants */}
            <Route 
              path="/admin/applicants/:jobId" 
              element={<PrivateRoute><AdminRoute><Applicants /></AdminRoute></PrivateRoute>} 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;