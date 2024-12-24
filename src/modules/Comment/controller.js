const express = require("express");
const router = express.Router();

const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const commentService = require("./service");
const { createCommentValidate } = require("./request");
const Comment = require("./model");
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
  const {data} = await commentService.getRepliesOfComment(commentId);
  sendResponse({
    res,
    data,
  });
});

router.post(
  "/create-comment",
  // authMiddleware,
  // roleMiddleware(["AD"]),
  createCommentHandler
);
router.get("/root-comments/:postId", getRootCommentHandler);
router.get("/replies/:commentId", getRepliesOfCommentHandler);
module.exports = router;
