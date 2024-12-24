const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "BU",
      // BU => Basic User
      // AD => Admin
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
