const mongoose = require("mongoose"); // Import Mongoose for database interactions.
const argon2 = require("argon2"); // Import Argon2 for password hashing.
const { required } = require("joi");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, // Field is a string.
      required: true, // Field is mandatory.
      unique: true, // Must be unique across the collection (correct the typo).
      trim: true, // Removes extra spaces.
    },
    email: {
      type: String, // Field is a string.
      required: true, // Field is mandatory.
      unique: true, // Must be unique (correct the typo).
      trim: true, // Removes extra spaces.
      lowercase: true, // Converts to lowercase before saving.
    },
    password: {
      type: String, // Field is a string.
      required: true, // Field is mandatory.
    },
    role: {
      type: String,
      enum: ["ADMIN", "HR", "EMP", "CAND"],
      required: true,
    },
    createdAt: {
      type: Date, // Field is a date.
      default: Date.now, // Defaults to the current date and time.
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields.
);

userSchema.pre("save", async function (next) {
  // Pre-save middleware for password hashing.
  if (this.isModified("password")) {
    // Only hash the password if it has been modified.
    try {
      this.password = await argon2.hash(this.password); // Hash the password.
    } catch (error) {
      return next(error); // Pass any errors to the next middleware.
    }
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  // Method to compare passwords.
  try {
    return await argon2.verify(this.password, candidatePassword); // Verify the password.
  } catch (error) {
    throw error; // Throw errors for handling elsewhere.
  }
};

userSchema.index({ username: "text" }); // Create a text index for the `username` field.

const User = mongoose.model("User", userSchema); // Create the User model based on the schema.

module.exports = User; // Export the User model for use in other files.
