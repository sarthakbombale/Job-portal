import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Layout = ({ children, searchTerm, setSearchTerm }) => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Navbar stays at the top */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Main Content Area with Page Transition Animations */}
      <main className="flex-grow-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer stays at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;