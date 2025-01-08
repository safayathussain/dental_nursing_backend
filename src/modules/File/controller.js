const express = require("express");
const router = express.Router();

const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const { upload } = require("../../utility/multer");

const uploadFileHandler = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendResponse({
      res,
      statusCode: 404,
      success: false,
      message: "No files uploaded",
    });
  }
  const fileUrls = req.files.map((file) => {
    return { url: `${file.savedName}` };
  });

  sendResponse({
    res,
    data: { files: fileUrls },
    message: "Files uploaded successfully",
    statusCode: 200,
    success: true,
  });
});

router.post(
  "/upload-files",
  authMiddleware,
  upload,
  uploadFileHandler
);
module.exports = router;
