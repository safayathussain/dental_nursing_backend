const express = require("express");
const router = express.Router();

const courseService = require("./service");
const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const { createCourseValidate } = require("./request");

const createCourseHandler = asyncHandler(async (req, res) => {
  const body = req.body;
  const { description, title, userId, url, thumbnail } = body;
  const validatedData = createCourseValidate(body);
  if (validatedData?.error?.message) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode, success } =
    await courseService.createCourse({
      description,
      title,
      userId,
      url,
      thumbnail,
    });
  sendResponse({ res, data, message, statusCode, success });
});
const editCourseHandler = asyncHandler(async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  const { description, title, userId, url, thumbnail } = body;
  const validatedData = createCourseValidate(body);
  if (validatedData?.error?.message) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode, success } = await courseService.editCourse(
    {
      id,
      description,
      title,
      userId,
      url,
      thumbnail,
    }
  );
  sendResponse({ res, data, message, statusCode, success });
});

const getAllCourseHandler = asyncHandler(async (req, res) => {
  const { limit, page, search, latest } = req.query;
  const { data, message, statusCode, success } = await courseService.getCourses(
    {
      limit,
      page,
      search,
      latest,
    }
  );

  sendResponse({ res, data: data, message, statusCode, success });
});
const deleteCourseHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode, success } = await courseService.deleteCourse(
    id
  );
  sendResponse({ res, data, message, statusCode, success });
});

router.get("/all-courses", getAllCourseHandler);
router.post(
  "/post-course",
  authMiddleware,
  roleMiddleware(["AD"]),
  createCourseHandler
);
router.put(
  "/update-course/:id",
  authMiddleware,
  roleMiddleware(["AD"]),
  editCourseHandler
);
router.delete(
  "/delete-course/:id",
  authMiddleware,
  roleMiddleware(["AD"]),
  deleteCourseHandler
);

module.exports = router;
