// email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendEmail = (to, subject, content) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
      
    }
  });
};

module.exports = { sendEmail };
