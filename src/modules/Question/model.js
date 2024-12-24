const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    reportedUser: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model("Question", QuestionSchema);

module.exports = QuestionModel;
