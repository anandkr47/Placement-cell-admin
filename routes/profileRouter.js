const express = require('express');
const router = express.Router();
const newLocal = "../controllers/profileController";
const profileController = require(newLocal);

// Create a new profile
router.post('/create_profile', profileController.createProfile);

// Edit an existing profile
router.post('/edit_profile/:id', profileController.editProfile);

module.exports = router;
