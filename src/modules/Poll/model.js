const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    options: [
      {
        value: {
          type: String,
          required: true,
        },
        voteCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    content: {
      type: String,
      required: true,
    },
    votedCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const pollResponseSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
  },
  { timestamps: true }
);
const Poll = mongoose.model("Poll", pollSchema);

const PollResponse = mongoose.model("PollResponse", pollResponseSchema);

module.exports = Poll;
module.exports.PollResponse = PollResponse;
