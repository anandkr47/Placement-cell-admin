// models/job.js

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
