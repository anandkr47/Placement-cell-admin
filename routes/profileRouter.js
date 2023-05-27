const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profile_controller');

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
router.post('/create_profile', upload.single('resume'), profileController.createProfile);

// Edit an existing profile
router.put('/edit_profile/:id', upload.single('resume'), profileController.editProfile);

module.exports = router;
