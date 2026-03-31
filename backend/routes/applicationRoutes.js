const express = require("express");
const router = express.Router();

const { applyJob, getApplicants } = require("../controllers/applicationController");
const { auth, admin } = require("../middleware/authMiddleware");

router.post("/apply/:jobId", auth, applyJob);
router.get("/applicants/:jobId", auth, admin, getApplicants);

module.exports = router;