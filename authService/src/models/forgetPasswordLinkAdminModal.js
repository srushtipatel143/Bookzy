const mongoose = require("mongoose");

const forgetPasswordAdminLinkSchema= new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "admincollections",
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


forgetPasswordAdminLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("forgetPasswordAdminLinkCollection", forgetPasswordAdminLinkSchema);
