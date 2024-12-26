const express = require("express");
const router = express.Router();

const pollService = require("./service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const PollModel = require("./model");

// Create a poll
const createPollHandler = asyncHandler(async (req, res) => {
  const { content, options, userId } = req.body;
  if (!content || typeof content !== "string")
    return sendResponse({
      message: "content is not valid",
      res,
      statusCode: 400,
      success: false,
    });

  if (!Array.isArray(options) || options.length < 2)
    return sendResponse({
      message: "At least two options are required",
      res,
      statusCode: 400,
      success: false,
    });

  const { data, message, statusCode, success } = await pollService.createPoll({
    content,
    options,
    userId,
  });

  sendResponse({ res, data, message, statusCode, success });
});

// Update a poll
const updatePollHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, options } = req.body;

  if (!content && !options)
    return sendResponse({
      message: "Nothing to update",
      res,
      statusCode: 400,
      success: false,
    });

  const { data, message, statusCode, success } = await pollService.updatePoll(
    id,
    { content, options }
  );

  sendResponse({ res, data, message, statusCode, success });
});

// Get all polls
const getAllPollsHandler = asyncHandler(async (req, res) => {
  const polls = await PollModel.find();
  sendResponse({ res, data: polls });
});

// Delete a poll
const deletePollHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, message, statusCode, success } = await pollService.deletePoll(
    id
  );

  sendResponse({ res, data, message, statusCode, success });
});

// Vote in a poll
const voteHandler = asyncHandler(async (req, res) => {
  const { pollId, optionId } = req.body;

  if (!pollId || !optionId)
    return sendResponse({
      message: "Poll ID and option id are required",
      res,
      statusCode: 400,
      success: false,
    });

  const { data, message, statusCode, success } = await pollService.voteInPoll(
    pollId,
    optionId
  );

  sendResponse({ res, data, message, statusCode, success });
});
const getLatestPoll = asyncHandler(async (req, res) => {
  const latestPoll = await PollModel.findOne().sort({ createdAt: -1 });
  sendResponse({
    res,
    statusCode: 200,
    message: "Latest poll retrieved successfully",
    data: latestPoll,
    success: true,
  });
});

// Routes
router.post(
  "/create-poll",
  // authMiddleware,
  // roleMiddleware(["AD"]),
  createPollHandler
);
router.put(
  "/update-poll/:id",
  // authMiddleware,
  // roleMiddleware(["AD"]),
  updatePollHandler
);
router.get("/all-polls", getAllPollsHandler);
router.delete("/delete-poll/:id", deletePollHandler);
router.post("/vote", voteHandler);
router.get("/latest-poll", getLatestPoll);

module.exports = router;
