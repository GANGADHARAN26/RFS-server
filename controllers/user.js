const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger");
const { validateRegistration } = require("../utils/Validation");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/emailSender");
const crypto = require("crypto");

// User registration
const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");
  try {
    // Validate the schema
    const { error } = validateRegistration(req.body);
    if (error) {
      console.log("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username, role } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create a new user
    user = new User({ username, email, password, role });
    await user.save();
    console.log("User saved successfully", user._id);

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // Return success response
    res.status(201).json({
      success: true,
      message: "User has been created",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log("Registration error occurred", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Compare the provided password with the stored password
      const isPasswordValid = await user.comparePassword(password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      // Generate tokens
      const { accessToken, refreshToken } = await generateTokens(user);
  
      // Log successful login
      const date = new Date();
      console.log(`User logged in: ${user.email} at ${date}`);
  
      // Send response
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Save OTP to database
    await OTP.create({
      email,
      otp
    });

    // Send email with OTP
    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
      html: `
        <h1>Password Reset</h1>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to email"
    });
  } catch (error) {
    logger.error("Error in requestPasswordReset:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });
  } catch (error) {
    logger.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { registerUser, loginUser, requestPasswordReset, resetPassword };
 