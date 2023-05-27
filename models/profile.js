const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
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
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      
    },
  ],
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
