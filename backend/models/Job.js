const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: String, 
  companyLogo: String,
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, default: "Not Disclosed" }, 
  experience: { type: String, default: "Freshers" },  
  skills: { type: String },
  createdAt: { type: Date, default: Date.now }, 
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);