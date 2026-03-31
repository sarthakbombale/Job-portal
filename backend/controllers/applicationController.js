const Application = require("../models/Application");

// APPLY JOB
exports.applyJob = async (req, res) => {
  const { jobId } = req.params;

  const alreadyApplied = await Application.findOne({
    userId: req.user.id,
    jobId
  });

  if (alreadyApplied) {
    return res.status(400).json({ msg: "Already applied" });
  }

  const app = await Application.create({
    userId: req.user.id,
    jobId
  });

  res.json(app);
};

// GET APPLICANTS (ADMIN)
exports.getApplicants = async (req, res) => {
  const { jobId } = req.params;

  const apps = await Application.find({ jobId })
    .populate("userId", "name email");

  res.json(apps);
};