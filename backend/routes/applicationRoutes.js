const express = require("express");
const router = express.Router();

// 1. ADD getApplicants TO THE DESTRUCTURED IMPORTS
const { applyJob, getUserApplications, getApplicants } = require("../controllers/applicationController");
const { auth, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Accept a single file field named 'resume' (optional)
router.post("/apply/:jobId", auth, upload.single('resume'), applyJob);
router.get("/user-applications", auth, getUserApplications);
router.get("/applicants/:jobId", auth, admin, getApplicants);

module.exports = router;