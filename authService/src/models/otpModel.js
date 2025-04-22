const mongoose = require("mongoose");

const optSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "UserCollection",
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 60 * 1000,
    },
  },
  { timestamps: true }
);


optSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpCollection", optSchema);
