const mongoose = require("mongoose");

const refreshToeknSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
refreshToeknSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const RefreshToken=mongoose.model('RefreshToken',refreshToeknSchema);
module.exports = RefreshToken;