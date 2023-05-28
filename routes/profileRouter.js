const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const profileController = require('../controllers/profile_controller');
const Profile = require('../models/profile');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination directory for uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Set the filename for uploaded files
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Create the Multer upload middleware
const upload = multer({ storage });

// Create a new profile
router.post('/create_profile', upload.single('resume'),profileController.createProfile);

// Edit an existing profile
router.post('/edit_profile/:id', upload.single('resume'),profileController.editProfile);

// Retrieve the resume file by profile ID
router.get('/profile/:id/resume', (req, res) => {
  const profileId = req.params.id;

  Profile.findById(profileId)
    .then((profile) => {
      if (!profile) {
        // Profile not found
        return res.status(404).send('Profile not found');
      }

      // Assuming you have a field named 'resume' in your Profile model
      const fileData = profile.resume.data;
      const fileName = profile.resume.fileName;
      const fileType = profile.resume.fileType;

      res.setHeader('Content-Type', fileType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      res.send(fileData);
    })
    .catch((err) => {
      console.error('Error retrieving profile', err);
      res.status(500).send('Failed to retrieve the file');
    });
});

// Render the edit profile page
router.get('/edit_profile/:id', (req, res) => {
  const profileId = req.params.id;

  Profile.findById(profileId)
    .then((profile) => {
      res.render('edit_profile', { title: 'Edit Profile', profile });
    })
    .catch((err) => {
      console.error('Error retrieving profile', err);
      req.flash('error', 'Failed to retrieve the profile');
      res.redirect('/');
    });
});

module.exports = router;
