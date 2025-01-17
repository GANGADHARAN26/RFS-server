const express = require('express');
const { 
  registerUser, 
  loginUser, 
  requestPasswordReset, 
  resetPassword 
} = require('../controllers/user');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;