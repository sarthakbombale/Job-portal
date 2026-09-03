// 1. Force stable DNS routing at the very top
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');
const fs = require('fs');

// Make sure uploads folder exists and serve it statically for resume access
const uploadsPath = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

const authRoutes = require("./routes/authRoutes");

app.use("/api", authRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);

const connectDB = require("./config/db");

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
