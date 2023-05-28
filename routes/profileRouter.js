const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Add the path module
const profileController = require('../controllers/profile_controller');
const { title } = require('process');

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
router.post('/edit_profile/:id', upload.single('resume'), profileController.editProfile);

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/', filename);
  res.sendFile(filePath);
});
router.get('/edit_profile/:id', (req, res) => {
  // Add your logic here to render the edit profile page
  // For example:
  res.render('edit_profile.js',{title:"edit profile"}); // Replace 'edit_profile' with your actual view file name
});

module.exports = router;
