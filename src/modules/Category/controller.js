const express = require("express");
const router = express.Router();

const categoryService = require("./service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const CategoryModel = require("./model");

const createCategoryHandler = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string")
    return sendResponse({
      message: "Name is not valid",
      res,
      statusCode: 400,
      success: false,
    });
  const { data, message, statusCode, success } =
    await categoryService.createCategory(name);
  sendResponse({ res, data, message, statusCode, success });
});
const updateCategoryHandler = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name || typeof name !== "string")
    return sendResponse({
      message: "Name is not valid",
      res,
      statusCode: 400,
      success: false,
    });
  const { data, message, statusCode, success } =
    await categoryService.updateCategory(name, id);
  sendResponse({ res, data, message, statusCode, success });
});
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.find();
  sendResponse({ res, data: categories });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } =
    await categoryService.deleteCategory(id);
  sendResponse({ res, data, message, statusCode, success });
});
router.post(
  "/create-category",
  // authMiddleware,
  // roleMiddleware(["AD"]),
  createCategoryHandler
);
router.put(
  "/update-category/:id",
  // authMiddleware,
  // roleMiddleware(["AD"]),
  updateCategoryHandler
);
router.get("/all-categories", getAllCategories);
router.delete("/delete-category/:id", deleteCategory);

module.exports = router;
