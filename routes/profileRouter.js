const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const profileController = require('../controllers/profile_controller');
const Profile = require('../models/profile');

// Create a new profile
router.post('/create_profile', profileController.createProfile);

// Edit an existing profile
router.post('/edit_profile/:id', profileController.editProfile);

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
