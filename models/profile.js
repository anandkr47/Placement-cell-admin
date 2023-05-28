const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true,
  },
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
    type: String,
    required: true,
  },
  
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
