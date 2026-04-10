const Job = require("../models/Job");
const Application = require("../models/Application"); // Import Application model
const jwt = require("jsonwebtoken");

// CREATE JOB (ADMIN) - Corrected to include all fields
exports.createJob = async (req, res) => {
  // Destructure EVERYTHING from req.body that your schema now supports
  const {
    title,
    description,
    location,
    salary,
    experience,
    skills,
    companyName,
    companyLogo
  } = req.body;

  try {
    const job = await Job.create({
      title,
      description,
      location,
      salary,      
      experience,  
      skills,      
      companyName, 
      companyLogo, 
      createdBy: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ msg: "Error creating job" });
  }
};

// GET ALL JOBS (With "Already Applied" Logic)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    const authHeader = req.headers.authorization;

    let appliedJobIds = [];

    // If a token is provided, find what this user has applied for
    if (authHeader) {
      try {
        const token = authHeader; // Assuming token is sent directly or handle "Bearer " split
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find all applications by this specific user
        const userApplications = await Application.find({ userId: decoded.id });


        appliedJobIds = userApplications.map(app => app.jobId.toString());
      } catch (tokenErr) {

        console.log("Invalid token in getJobs");
      }
    }

    const jobsWithStatus = jobs.map(job => ({
      ...job._doc,
      isApplied: appliedJobIds.includes(job._id.toString())
    }));

    res.json(jobsWithStatus);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

// UPDATE JOB
// backend/controllers/jobController.js
exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // This takes everything from the frontend form
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server Error during update" });
  }
};
// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: "Job deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting job" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Logic to check if the current user has already applied to this specific job
    const authHeader = req.headers.authorization;
    let isApplied = false;

    if (authHeader) {
      try {
        // Handle Bearer token if present, otherwise use direct string
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const application = await Application.findOne({
          jobId: req.params.id,
          userId: decoded.id
        });

        if (application) isApplied = true;
      } catch (tokenErr) {
        console.log("Token verification failed in getJobById");
      }
    }

    // Return job details with applied status
    res.json({
      ...job._doc,
      isApplied
    });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.status(500).json({ msg: "Error fetching job details" });
  }
};