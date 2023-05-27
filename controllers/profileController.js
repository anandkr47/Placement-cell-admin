const Profile = require('../models/profile');

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { about, mobile, github, linkedin, hackerrank, leetcode } = req.body;
    const { resume } = req.files;

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
        data: resume.data,
        contentType: resume.mimetype,
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
    const { resume } = req.files;

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

    if (resume) {
      profile.resume = {
        data: resume.data,
        contentType: resume.mimetype,
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
