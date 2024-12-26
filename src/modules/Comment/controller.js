const express = require("express");
const router = express.Router();

const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
// const authMiddleware = require("../../middlewares/authMiddleware");
// const roleMiddleware = require("../../middlewares/roleMiddleware");
const commentService = require("./service");
const { createCommentValidate } = require("./request");
const Comment = require("./model");
const authMiddleware = require("../../middlewares/authMiddleware");

const createCommentHandler = asyncHandler(async (req, res) => {
  const { error, value } = createCommentValidate(req.body);
  if (error) {
    return sendResponse({
      message: error.details.map((err) => err.message).join(", "),
      res,
      statusCode: 400,
      success: false,
    });
  }
  const {
    postId,
    parentId,
    rootCommentId,
    likedUser,
    reportedUser,
    content,
    userId,
    postType,
    childrensCount,
  } = value;
  const { data, message, statusCode, success } =
    await commentService.createComment({
      postId,
      parentId,
      rootCommentId,
      likedUser,
      reportedUser,
      content,
      userId,
      postType,
      childrensCount,
    });
  sendResponse({ res, data, message, statusCode, success });
});

const getRootCommentHandler = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const totalComments = await Comment.countDocuments({
    postId,
    parentId: null,
  });

  const comments = await Comment.find({ postId, parentId: null })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name profilePicture")
    .exec();
  sendResponse({
    res,
    data: {
      comments,
      totalComments,
    },
  });
});
const getRepliesOfCommentHandler = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { data } = await commentService.getRepliesOfComment(commentId);
  sendResponse({
    res,
    data,
  });
});
const getLatestRootCommentHandler = asyncHandler(async (req, res) => {
  const { postId, time } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sinceTime = new Date(time);
  const totalComments = await Comment.countDocuments({
    postId,
    parentId: null,
    createdAt: { $gt: sinceTime },
  });
  const comments = await Comment.find({
    postId,
    parentId: null,
    createdAt: { $gt: sinceTime },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "name profilePicture")
    .exec();
  sendResponse({
    res,
    data: {
      comments,
      totalComments,
    },
  });
});
const likeCommentHandler = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { data, message, statusCode, success } =
    await commentService.likeComment(req, commentId);
  sendResponse({ res, data, message, statusCode, success });
});
const dislikeCommentHandler = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { data, message, statusCode, success } =
    await commentService.dislikeComment(req, commentId);
  sendResponse({ res, data, message, statusCode, success });
});
router.post(
  "/create-comment",
  // authMiddleware,
  // roleMiddleware(["AD"]),
  createCommentHandler // Pass the io instance to the handler
);
router.get("/root-comments/:postId", getRootCommentHandler);
router.get("/latest-root-comments/:postId/:time", getLatestRootCommentHandler);
router.get("/replies/:commentId", getRepliesOfCommentHandler);
router.post("/like/:commentId", authMiddleware, likeCommentHandler);
router.post("/dislike/:commentId", authMiddleware, dislikeCommentHandler);
module.exports = router;
