const Profile = require('../models/profile');
const multer = require('multer');

// Create a multer storage instance
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name for uploaded files
  }
});

// Create a multer upload instance
const upload = multer({ storage: storage });

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { about, mobile, github, linkedin, hackerrank, leetcode } = req.body;

    // Check if resume file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file found in the request.' });
    }

    // Create a new profile document
    const newProfile = new Profile({
      students: [],
      about,
      mobile,
      github,
      linkedin,
      hackerrank,
      leetcode,
      resume: {
        data: req.file.path,
        contentType: req.file.mimetype,
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
exports.editProfile = async (req, res) => {
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

    // Check if resume file is uploaded
    if (req.file) {
      // Update the resume in the profile
      profile.resume = {
        data: req.file.path,
        contentType: req.file.mimetype,
      };
    }

    // Save the updated profile to the database
    const updatedProfile = await profile.save();

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while editing the profile.' });
  }
};
