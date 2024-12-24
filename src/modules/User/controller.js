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

router.get("/firebaseIdWithToken/:id", getUserByFirebaseIdHandler);

module.exports = router;
