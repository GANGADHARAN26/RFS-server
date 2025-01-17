const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const sendEmail = asyncHandler(async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Port for TLS
    secure: false, // Use false for TLS, true for SSL
    auth: {
      user: process.env.NODEMAILER_USER, // Gmail address
      pass: process.env.NODEMAILER_PASS, // Gmail app password
    },
    logger: true, // Add this line for detailed logs
    debug: true,  // Add this line for detailed debug information
  }); 

  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  return info;
});

module.exports = sendEmail;