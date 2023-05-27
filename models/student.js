const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    college: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    dsa_score: {
      type: Number,
      required: true,
    },
    webdev_score: {
      type: Number,
      required: true,
    },
    react_score: {
      type: Number,
      required: true,
    },
    placement_status: {
      type: String,
      enum: ["Placed", "Not placed"],
      required: true,
    },
    interviews: [
      {
        company: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
        result: {
          type: String,
          enum: ["PASS", "FAIL", "Didn't Attempt", "On Hold","On Going"],
        },
      },
    ],
    profile: [
      {
        about: {
          type: String,
          required: true,
        },
        mobile: {
          type: String,
          required: true,
        },
        github: {
          type: String,
          required: true,
        },
        linkedin: {
          type: String,
          required: true,
        },
        hackerrank: {
          type: String,
          required: true,
        },
        leetcode: {
          type: String,
          required: true,
        },
        resume: {
          data: Buffer,
          contentType: String,
        },
    },
    ],
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
