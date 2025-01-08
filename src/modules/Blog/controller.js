const express = require("express");
const router = express.Router();

const blogService = require("./service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const { createBlogValidate } = require("./request");

const createBlogHandler = asyncHandler(async (req, res) => {
  const body = req.body;
  const { content, title, userId, categories, tags , thumbnail} = body;
  const validatedData = createBlogValidate(body);
  if (validatedData?.error?.message) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode, success } = await blogService.createBlog({
    content,
    title,
    userId,
    categories,
    tags,
    thumbnail
  });
  sendResponse({ res, data, message, statusCode, success });
});
const editBlogHandler = asyncHandler(async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  const { content, title, userId, categories, tags, thumbnail } = body;
  const validatedData = createBlogValidate(body);
  if (validatedData?.error?.message) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode, success } = await blogService.editBlog({
    id,
    content,
    title,
    userId,
    categories,
    tags,
    thumbnail
  });
  sendResponse({ res, data, message, statusCode, success });
});

const getAllBlogsHandler = asyncHandler(async (req, res) => {
  const { limit, page, search, category, latest } = req.query;
  const { data, message, statusCode, success } = await blogService.getBlogs({
    limit,
    page,
    search,
    category,
    latest,
  });

  sendResponse({ res, data: data, message, statusCode, success });
});
const getBlogHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } =
    await blogService.getSingleBlog(id);
  sendResponse({ res, data: data, message, statusCode, success });
});
const deleteBlogHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } = await blogService.deleteBlog(
    id
  );
  sendResponse({ res, data, message, statusCode, success });
});

router.get("/all-blogs", getAllBlogsHandler);
router.post(
  "/post-blog",
  authMiddleware,
  roleMiddleware(["AD"]),
  createBlogHandler
);
router.put(
  "/edit-blog/:id",
  authMiddleware,
  roleMiddleware(["AD"]),
  editBlogHandler
);
router.delete(
  "/delete-blog/:id",
  authMiddleware,
  roleMiddleware(["AD"]),
  deleteBlogHandler
);

// take it in last
router.get("/:id", getBlogHandler);

module.exports = router;
