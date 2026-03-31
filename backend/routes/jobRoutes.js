const express = require("express");
const router = express.Router();

const { createJob, getJobs, updateJob, deleteJob } = require("../controllers/jobController");
const { auth, admin } = require("../middleware/authMiddleware");

router.post("/jobs", auth, admin, createJob);
router.get("/jobs", getJobs);

router.put("/jobs/:id", auth, admin, updateJob);
router.delete("/jobs/:id", auth, admin, deleteJob);

module.exports = router;