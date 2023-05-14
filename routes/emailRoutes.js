const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Define your route handler for /submit-query
router.post('/submit-query', (req, res) => {
  const { name, email, message } = req.body;

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
    from: email,
    to: process.env.EMAIL_USER, // Update with your email address
    subject: 'Query from Placement Cell',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error sending email',
      });
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Email sent successfully',
      });
      res.redirect('/student_dashboard/' + encodeURIComponent(email));
    }
  });
  
});

module.exports = router;
