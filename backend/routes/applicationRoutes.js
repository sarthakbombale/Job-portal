const express = require("express");
const router = express.Router();

// 1. ADD getApplicants TO THE DESTRUCTURED IMPORTS
const { applyJob, getUserApplications, getApplicants } = require("../controllers/applicationController");
const { auth, admin } = require("../middleware/authMiddleware");

router.post("/apply/:jobId", auth, applyJob);
router.get("/user-applications", auth, getUserApplications);
router.get("/applicants/:jobId", auth, admin, getApplicants);

module.exports = router;