const Job = require("../models/Job");
const Application = require("../models/Application");
const jwt = require("jsonwebtoken");
const { invalidateCache } = require("../middleware/cacheMiddleware");

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

    // Invalidate jobs list cache when new job is created
    invalidateCache("jobs");

    res.status(201).json(job);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ msg: "Error creating job" });
  }
};

// GET ALL JOBS (With "Already Applied" Logic)
exports.getJobs = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const [jobs, appliedJobIds] = await Promise.all([
      Job.find({})
        .sort({ createdAt: -1 })
        .select("title description location salary experience skills companyName companyLogo createdAt")
        .lean(),
      (async () => {
        if (!authHeader) return [];

        try {
          const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          const userApplications = await Application.find({ userId: decoded.id })
            .select("jobId")
            .lean();

          return userApplications.map(app => app.jobId.toString());
        } catch (tokenErr) {
          console.log("Invalid token in getJobs");
          return [];
        }
      })()
    ]);

    res.json(jobs.map(job => ({
      ...job,
      isApplied: appliedJobIds.includes(job._id.toString())
    })));
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    invalidateCache("jobs");
    invalidateCache(req.params.id);

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server Error during update" });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    invalidateCache("jobs");
    invalidateCache(req.params.id);

    res.json({ msg: "Job deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting job" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const [job, isApplied] = await Promise.all([
      Job.findById(req.params.id)
        .select("title description location salary experience skills companyName companyLogo createdAt")
        .lean(),
      (async () => {
        if (!authHeader) return false;

        try {
          const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          const application = await Application.exists({
            jobId: req.params.id,
            userId: decoded.id
          });

          return Boolean(application);
        } catch (tokenErr) {
          console.log("Token verification failed in getJobById");
          return false;
        }
      })()
    ]);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.json({
      ...job,
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