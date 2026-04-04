const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, default: "Not Disclosed" }, // Added default
  experience: { type: String, default: "Freshers" },  // Added default
  skills: { type: String }, 
  createdAt: { type: Date, default: Date.now }, // Added missing comma here -> ,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);