const express = require("express");
const router = express.Router();
const { sendResponse } = require("../../utility/response");
const userService = require("./service");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createUserValidate } = require("./request");

const registerHandler = asyncHandler(async (req, res) => {
  const { email, name, role, profilePicture, firebaseUid, provider } = req.body;
  const validatedData = createUserValidate({
    email,
    name,
    role,
    profilePicture,
    firebaseUid,
  });
  if (validatedData.error) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode } = await userService.UserRegister(
    email,
    name,
    profilePicture,
    firebaseUid,
    provider,
    res
  );
  sendResponse({ res, data, message, statusCode });
});
const adminRegisterHandler = asyncHandler(async (req, res) => {
  const { email, name, role, profilePicture, firebaseUid, provider } = req.body;
  const validatedData = createUserValidate({
    email,
    name,
    role,
    profilePicture,
    firebaseUid,
  });
  if (validatedData.error) {
    return sendResponse({
      res,
      success: false,
      message: validatedData.error.message,
      statusCode: 500,
    });
  }
  const { data, message, statusCode } = await userService.UserRegister(
    email,
    name,
    role,
    profilePicture,
    firebaseUid,
    provider,
    res
  );
  sendResponse({ res, data, message, statusCode });
});
const verifyOtpHandler = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const { data, message, statusCode, success } = await userService.VerifyOtp(
    email,
    otp,
    res
  );
  sendResponse({ res, data, message, statusCode, success });
});
const sendOtpHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { data, message, statusCode } = await userService.sendOtp(email);
  sendResponse({ res, data, message, statusCode });
});
const setPasswordHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { data, message, statusCode } = await userService.setPassword(
    email,
    password,
    res
  );
  sendResponse({ res, data, message, statusCode });
});
const refreshTokenHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return sendResponse({
      message: "Refresh token missing",
      statusCode: 500,
      res,
      success: false,
    });
  }
  const { data, message, statusCode } = await userService.refreshToken(
    refreshToken
  );
  sendResponse({ res, data, message, statusCode });
});
const logoutHandler = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  sendResponse({ res });
});

router.post("/register", registerHandler);
router.post("/admin-register", adminRegisterHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/send-otp", sendOtpHandler);
router.post("/set-password", setPasswordHandler);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logoutHandler);

module.exports = router;
