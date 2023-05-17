// Define your route handler for /submit-task
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
router.post('/submit-dsatask', (req, res) => {
    const { name, email, task, hackerrankLink, leetcodeLink } = req.body;
  
    require('dotenv').config();
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });
    
    // Compose the email message
    const mailOptions = {
      from: `<${email}>`,
      to: process.env.EMAIL_USER, // Update with your email address
      subject: 'Task Submission from Student',
      text: `Name: ${name}\nEmail: ${email}\nTask: ${task}\nHackerRank Profile Link: ${hackerrankLink}\nLeetCode Profile Link: ${leetcodeLink}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending Task:', error);
        req.flash('error', 'Error sending Task!');
        return res.redirect('back');
      } else {
        console.log('Email sent:', info.response);
        req.flash('success', 'Task submitted!');
        return res.redirect('back');
      }
    });
  });
   
    module.exports = router;