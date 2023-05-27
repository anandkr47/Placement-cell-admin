const express = require('express');
const router = express.Router();
const newLocal = "../controllers/profileController";
const profileController = require(newLocal);

// Create a new profile
router.post('/create_profile', upload.single('resume'), profileController.createProfile);
router.put('/profile/:id', upload.single('resume'), profileController.editProfile);


module.exports = router;
