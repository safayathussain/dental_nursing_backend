const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      default: [],
    },
    likedUser: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("Blog", BlogSchema);

module.exports = BlogModel;
