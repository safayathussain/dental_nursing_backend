const mongoose = require("mongoose");
const SettingSchema = new mongoose.Schema(
  {
    linkedIn: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

const SettingModel = mongoose.model("Setting", SettingSchema);

module.exports = SettingModel;
