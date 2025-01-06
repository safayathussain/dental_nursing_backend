const express = require("express");
const router = express.Router();

const userService = require("../User/service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

const getUserByFirebaseIdHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data } = await userService.getUserByFirebaseId(id, res);
  sendResponse({ res, data });
});
const getAllUsers = asyncHandler(async (req, res) => {
  const { limit, page, search, latest } = req.query;
  const { data, message, statusCode, success } = await userService.getUsers({
    limit,
    page,
    search,
    latest,
  });

  sendResponse({ res, data: data, message, statusCode, success });
});
router.get("/firebaseIdWithToken/:id", getUserByFirebaseIdHandler);
router.get("/all-users", getAllUsers);
module.exports = router;
