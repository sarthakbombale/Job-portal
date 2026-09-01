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
});

// Enforces one application per user per job
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

// NOTE: You don't actually need this explicit single index:
// applicationSchema.index({ jobId: 1 }); 
// MongoDB can automatically use the right-side properties of compound keys if queried effectively,
// but keeping it is completely fine if you're executing heavy population queries.

module.exports = mongoose.model("Application", applicationSchema);