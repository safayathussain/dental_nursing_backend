const express = require("express");
const router = express.Router();

const pollService = require("./service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const PollModel = require("./model");
const UserModel = require("../User/model");
// Create a poll
const createPollHandler = asyncHandler(async (req, res) => {
  const { content, options, userId } = req.body;
  if (!content || typeof content !== "string")
    return sendResponse({
      message: "Invalid poll content",
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
  const { limit, page, search, category, latest } = req.query;
  const { data, message, statusCode, success } = await pollService.getPolls({
    limit,
    page,
    search,
    category,
    latest,
  });

  sendResponse({ res, data: data, message, statusCode, success });
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
  const { pollId, optionId, userId } = req.body;
  const user = await UserModel.findById(userId);
  if (!user)
    return sendResponse({
      message: "User not found",
      res,
      statusCode: 400,
      success: false,
    });
  if (!pollId || !optionId)
    return sendResponse({
      message: "Poll ID and option ID are required",
      res,
      statusCode: 400,
      success: false,
    });

  const { data, message, statusCode, success } = await pollService.voteInPoll(
    pollId,
    optionId,
    userId
  );

  sendResponse({ res, data, message, statusCode, success });
});
const getLatestPoll = asyncHandler(async (req, res) => {
  const latestPoll = await PollModel.findOne().sort({ createdAt: -1 });
  sendResponse({
    res,
    statusCode: 200,
    message: "Poll retrieved",
    data: latestPoll,
    success: true,
  });
});
const getPollById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const poll = await PollModel.findById(id);
  sendResponse({
    res,
    statusCode: 200,
    message: "Poll retrieved",
    data: poll,
    success: true,
  });
});
const getPollResponseByUserId = asyncHandler(async (req, res) => {
  const { pollId, userId } = req.params;
  const poll = await PollModel.PollResponse.findOne({ pollId, userId });
  sendResponse({
    res,
    statusCode: 200,
    message: "Poll response retrieved",
    data: poll,
    success: true,
  });
});

// Routes
router.post(
  "/create-poll",
  authMiddleware,
  roleMiddleware(["AD"]),
  createPollHandler
);
router.put(
  "/update-poll/:id",
  authMiddleware,
  roleMiddleware(["AD"]),
  updatePollHandler
);
router.get("/all-polls", getAllPollsHandler);
router.delete(
  "/delete-poll/:id",
  authMiddleware,
  roleMiddleware(["AD"]),
  deletePollHandler
);
router.post("/vote", authMiddleware, voteHandler);
router.get("/latest-poll", getLatestPoll);
router.get("/poll-response/:pollId/:userId", getPollResponseByUserId);

router.get("/:id/", getPollById);
module.exports = router;
