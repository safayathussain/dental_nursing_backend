const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { sendEmail } = require("../../utility/email");
const router = express.Router();

const CourseModel = require("../Course/model");
const UserModel = require("../User/model");
const { asyncHandler } = require("../../utility/common");
const { sendResponse } = require("../../utility/response");
const getMailTemplate = (data, course, user) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Form Submission</title>
  </head>
  <body
    style="
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <p>Hi Team,</p>
      <p>
        You have received a new contact form submission. Here are the details:
      </p>

      <table
        style="width: 100%; border-collapse: collapse; margin-bottom: 20px"
      >
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Name:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Email:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Phone:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Study Mode:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.mode}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Course:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd"><a href="${course?.url}" target="_blank">Click Here</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>How Did You Hear About Us:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.hear}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Preferred Contact:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.contactBy}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd">
            <strong>Message:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd">${data.message}</td>
        </tr>
      </table>

      <p style="text-align: center; color: #555">
        <small
          >This email was automatically generated from your website's contact
          form.</small
        >
      </p>
    </div>
  </body>
</html>
    `;
};

const validator = require("validator"); // Make sure to install the validator package

const sendMailContact = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data?.email || !data?.course || !data?.sendByMail) {
    return sendResponse({
      res,
      status: 400,
      message: "Missing required fields",
    });
  }
  if (!validator.isEmail(data?.email)) {
    return sendResponse({ res, status: 400, message: "Invalid email address" });
  }
  if (!validator.isEmail(data?.sendByMail)) {
    return sendResponse({
      res,
      status: 400,
      message: "Invalid sendByMail address",
    });
  }
  const course = await CourseModel.findById(data?.course);
  if (!course) {
    return sendResponse({ res, status: 404, message: "Course not found" });
  }
  const user = await UserModel.findOne({ email: data?.email });
  if (!user) {
    return sendResponse({ res, status: 404, message: "User not found" });
  }
  const tamplate = getMailTemplate(data, course, user);

  sendEmail(data?.sendByMail, "Contact for course", tamplate);
  sendResponse({ res, message: "Contact mail sent successfully" });
});

router.post("/send-mail", authMiddleware, sendMailContact);

module.exports = router;
