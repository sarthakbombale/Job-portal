const express = require("express");
const router = express.Router();

// 1. Add getJobById to your controller imports
const { 
  createJob, 
  getJobs, 
  getJobById, // Add this
  updateJob, 
  deleteJob 
} = require("../controllers/jobController");

const { auth, admin } = require("../middleware/authMiddleware");

router.post("/jobs", auth, admin, createJob);
router.get("/jobs", getJobs);

// 2. ADD THIS ROUTE: Get single job details
// Note: This must be GET /jobs/:id to match your frontend call
router.get("/jobs/:id", auth, getJobById); 

router.put("/jobs/:id", auth, admin, updateJob);
router.delete("/jobs/:id", auth, admin, deleteJob);

module.exports = router;