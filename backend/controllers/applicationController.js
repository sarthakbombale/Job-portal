const Application = require("../models/Application");

// APPLY JOB (CANDIDATE)
exports.applyJob = async (req, res) => {
  const { jobId } = req.params;
  const alreadyApplied = await Application.findOne({ userId: req.user.id, jobId });

  if (alreadyApplied) {
    return res.status(400).json({ msg: "Already applied" });
  }

  const app = await Application.create({ userId: req.user.id, jobId });
  res.json(app);
};

// GET USER'S APPLICATIONS (CANDIDATE HISTORY)
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id })
      .populate("jobId", "title company location");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// GET ALL APPLICANTS FOR A SPECIFIC JOB (ADMIN)
exports.getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    // We find by jobId and populate the user details
    const apps = await Application.find({ jobId })
      .populate("userId", "name email");

    res.json(apps);
  } catch (err) {
    console.error("Fetch Applicants Error:", err);
    res.status(500).json({ msg: "Error fetching applicants" });
  }  
};