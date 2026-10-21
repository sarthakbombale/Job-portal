const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Prevents orphan applications
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true // Prevents orphan applications
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
  ,
  // Resume metadata (optional)
  resume: {
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String }
  }
  ,
  // Application status tracking
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  statusUpdatedAt: { type: Date }
});

// Enforces one application per user per job
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, appliedAt: -1 });
applicationSchema.index({ jobId: 1, appliedAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);