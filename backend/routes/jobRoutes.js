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
const { cacheMiddleware } = require("../middleware/cacheMiddleware");

// Cache GET requests for 5 minutes
router.get("/jobs", cacheMiddleware(1000 * 60 * 5), getJobs);

// 2. ADD THIS ROUTE: Get single job details
// Note: This must be GET /jobs/:id to match your frontend call
// Cache for 10 minutes as individual job details don't change often
router.get("/jobs/:id", auth, cacheMiddleware(1000 * 60 * 10), getJobById);

router.post("/jobs", auth, admin, createJob);
router.put("/jobs/:id", auth, admin, updateJob);
router.delete("/jobs/:id", auth, admin, deleteJob);

module.exports = router;