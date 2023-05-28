const Profile = require('../models/profile');
const Student = require('../models/student');
// const multer = require('multer');

// Create a multer storage instance

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { email, about, mobile, github, linkedin, hackerrank, leetcode, resume } = req.body;

    // Create a new profile document
    const newProfile = new Profile({
      email,
      about,
      mobile,
      github,
      linkedin,
      hackerrank,
      leetcode,
      resume,
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();
    req.flash("success", "Profile added successfully!");
    return res.redirect("back");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the profile.' });
  }
};

// Edit an existing profile
exports.editProfile = async (req, res) => {
  try {
    const { about, mobile, github, linkedin, hackerrank, leetcode, resume } = req.body;
    const profileId = req.params.id;

    // Find the profile by ID
    const profile = await Profile.findById(profileId);

    // Update the profile fields
    profile.about = about;
    profile.mobile = mobile;
    profile.github = github;
    profile.linkedin = linkedin;
    profile.hackerrank = hackerrank;
    profile.leetcode = leetcode;
    profile.resume = resume;

    // Save the updated profile to the database
    const updatedProfile = await profile.save();
    req.flash("success", "Profile updated successfully!");
    return res.redirect("back");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while editing the profile.' });
  }
};
