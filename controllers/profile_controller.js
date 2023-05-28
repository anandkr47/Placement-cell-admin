const Profile = require('../models/profile');
const Student = require('../models/student');
const multer = require('multer');

// Create a multer storage instance

// Create a new profile
// Create a new profile
exports.createProfile = upload.single('resume'), async (req, res) => {
  try {
    const { email, about, mobile, github, linkedin, hackerrank, leetcode } = req.body;

    // Check if resume file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Create a new profile document
    const newProfile = new Profile({
      email,
      about,
      mobile,
      github,
      linkedin,
      hackerrank,
      leetcode,
      resume: {
        data: req.file.buffer,
        fileName: req.file.filename,
        fileType: req.file.mimetype,
      },
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the profile.' });
  }
};

// Edit an existing profile
exports.editProfile = upload.single('resume'), async (req, res) => {
  try {
    const { about, mobile, github, linkedin, hackerrank, leetcode } = req.body;
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

    if (req.file) {
      profile.resume = {
        data: req.file.buffer,
        fileName: req.file.filename,
        fileType: req.file.mimetype,
      };
    }

    // Save the updated profile to the database
    const updatedProfile = await profile.save();
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while editing the profile.' });
  }
};
