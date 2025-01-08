const express = require("express");
const router = express.Router();

const questionService = require("./service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const QuestionModel = require("./model");
const { createQuestionValidate } = require("./request");

const createQuestionHandler = asyncHandler(async (req, res) => {
  const body = req.body;
  const { content, title, userId, categories } = body;
  const validatedData = createQuestionValidate(body);
  if (validatedData?.error?.message) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode, success } =
    await questionService.createQuestion({
      content,
      title,
      userId,
      categories,
    });
  sendResponse({ res, data, message, statusCode, success });
});

const getAllQuestionHandler = asyncHandler(async (req, res) => {
  const { limit, page, search, category, latest, userId } = req.query;
  const { data, message, statusCode, success } =
    await questionService.getQuestions({
      limit,
      page,
      search,
      category,
      latest,
      userId,
    });

  sendResponse({ res, data: data, message, statusCode, success });
});
const getQuestionHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } =
    await questionService.getSingleQuestion(id);
  sendResponse({ res, data: data, message, statusCode, success });
});
const deleteQuestionHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, message, statusCode, success } =
    await questionService.deleteQuestion(id, req._id);
  sendResponse({ res, data, message, statusCode, success });
});
const likeQuestionHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } =
    await questionService.likeQuestion(req, id);
  sendResponse({ res, data, message, statusCode, success });
});
const dislikeQuestionHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } =
    await questionService.dislikeQuestion(req, id);
  sendResponse({ res, data, message, statusCode, success });
});
router.get("/all-questions", getAllQuestionHandler);
router.post("/post-question", authMiddleware, createQuestionHandler);
router.delete("/delete-question/:id", authMiddleware, deleteQuestionHandler);
router.post("/like/:id", authMiddleware, likeQuestionHandler);
router.post("/dislike/:id", authMiddleware, dislikeQuestionHandler);

// take it in last
router.get("/:id", getQuestionHandler);

module.exports = router;
