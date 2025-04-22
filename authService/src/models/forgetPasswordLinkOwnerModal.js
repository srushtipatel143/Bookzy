const mongoose = require("mongoose");

const forgetPasswordOwnerLinkSchema= new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "ownercollections",
    },
    token: {
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


forgetPasswordOwnerLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("forgetPasswordLinkOwnerCollection", forgetPasswordOwnerLinkSchema);
