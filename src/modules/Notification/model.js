const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces
    },
    sendTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model for the Notification schema
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
