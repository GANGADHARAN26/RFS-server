const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Import crypto module

const generateTokens = async (user) => {
  try {
    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    // Generate refresh token
    const refreshToken = crypto.randomBytes(40).toString("hex");

    // Set refresh token expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    // Store the refresh token in the database
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt,
    });

    // Return both tokens
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error.message);
    throw new Error("Token generation failed");
  }
};

module.exports = generateTokens;
