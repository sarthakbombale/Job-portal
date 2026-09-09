const Application = require("../models/Application");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");
const { renderTemplate } = require("../utils/emailTemplate");

// Helper function to format date
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// APPLY JOB (CANDIDATE)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const alreadyApplied = await Application.findOne({ userId: req.user.id, jobId });
    if (alreadyApplied) return res.status(400).json({ msg: "Already applied" });

    // If multer saved a file, include metadata
    const resumeMeta = req.file
      ? {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          url: `/uploads/resumes/${req.file.filename}`
        }
      : undefined;

    const payload = { userId: req.user.id, jobId };
    if (resumeMeta) payload.resume = resumeMeta;

    const app = await Application.create(payload);
    res.json(app);
  } catch (err) {
    console.error('Apply Job Error:', err);
    if (err.code === 11000) return res.status(400).json({ msg: 'Already applied' });
    res.status(500).json({ msg: 'Server error while applying' });
  }
};


// GET USER'S APPLICATIONS (CANDIDATE HISTORY)
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id })
      // Make sure "companyName" and "companyLogo" are included here
      .populate("jobId", "title companyName companyLogo location")
      .sort({ appliedAt: -1 }).lean();

    res.json(apps);
  } catch (err) {
    console.error("Fetch User Apps Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
// GET ALL APPLICANTS FOR A SPECIFIC JOB (ADMIN)
exports.getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    // We find by jobId and populate the user details
    const apps = await Application.find({ jobId })
      .populate("userId", "name email").lean();

    res.json(apps);
  } catch (err) {
    console.error("Fetch Applicants Error:", err);
    res.status(500).json({ msg: "Error fetching applicants" });
  }
};

// ADMIN: Update an application's status and notify the candidate via email
exports.updateStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status, message } = req.body;

    if (!['pending','accepted','rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const app = await Application.findById(appId)
      .populate('userId', 'name email')
      .populate('jobId', 'title companyName');
    if (!app) return res.status(404).json({ msg: 'Application not found' });

    app.status = status;
    app.statusUpdatedAt = new Date();
    await app.save();

    // Send notification email (best-effort)
    const to = app.userId?.email;
    if (to) {
      try {
        // Prepare template data
        const templateData = {
          candidateName: app.userId.name || 'Candidate',
          status: status.charAt(0).toUpperCase() + status.slice(1),
          jobTitle: app.jobId?.title || 'Position',
          companyName: app.jobId?.companyName || 'Company',
          appliedDate: formatDate(app.appliedAt),
          updatedDate: formatDate(app.statusUpdatedAt),
          customMessage: message || '',
          dashboardUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/my-applications` : 'http://localhost:5173/my-applications',
          jobsUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/jobs` : 'http://localhost:5173/jobs',
          supportEmail: process.env.SUPPORT_EMAIL || 'support@jobportal.com'
        };

        // Render email template
        const htmlContent = renderTemplate('applicationStatus', templateData);

        // Prepare subject line
        const statusMessages = {
          accepted: `Great news! You're selected for ${app.jobId?.title || 'the position'}`,
          rejected: `Update on your application for ${app.jobId?.title || 'the position'}`,
          pending: `Your application for ${app.jobId?.title || 'the position'} is under review`
        };

        const subject = statusMessages[status] || `Your application status has been updated to ${status}`;

        // Send email
        await sendMail({ to, subject, html: htmlContent });
        console.log(`Status email sent to ${to} for application ${appId}`);
      } catch (e) {
        console.error('Failed to send status email:', e);
        // Don't fail the whole request if email fails
      }
    }

    res.json({ msg: 'Status updated', app });
  } catch (err) {
    console.error('Update Application Status Error:', err);
    res.status(500).json({ msg: 'Server error updating status' });
  }
};