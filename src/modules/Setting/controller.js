const express = require("express");
const router = express.Router();

const { sendResponse } = require("../../utility/response");
const { asyncHandler } = require("../../utility/common");
const authMiddleware = require("../../middlewares/authMiddleware");
const SettingModel = require("./model");
const roleMiddleware = require("../../middlewares/roleMiddleware");

const updateSettingHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const existedSetting = await SettingModel.find();
  if (existedSetting?.length > 0) {
    await SettingModel.updateOne(
      { _id: existedSetting[0]._id },
      { $set: data }
    );
  } else {
    await SettingModel.create(data);
  }

  sendResponse({
    res,
    data: { message: "Setting updated" },
    message: "Setting updated",
    statusCode: 200,
    success: true,
  });
});
const getSettingHandler = asyncHandler(async (req, res) => {
  const settings = await SettingModel.find();

  sendResponse({
    res,
    data: settings?.[0],
    message: "Settings retrieved",
    statusCode: 200,
    success: true,
  });
});

router.post(
  "/update",
  authMiddleware,
  roleMiddleware(["AD"]),
  updateSettingHandler
);
router.get("/get", getSettingHandler);
module.exports = router;
