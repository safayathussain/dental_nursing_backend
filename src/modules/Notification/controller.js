const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../../utility/common");
const Notification = require("./model");
const NotificationService = require("./service");
const { sendResponse } = require("../../utility/response");
const getAllNotificationByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notifications = await Notification.find({ sendTo: id }).populate('sendBy');
  const isAllRead = notifications.every(
    (notification) => notification.readStatus === true
  );
  sendResponse({
    res,
    data: {
      notifications,
      isAllRead,
    },
  });
});
const readAllNotificationsHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message } = NotificationService.readAllNotifications(id);
  sendResponse({
    res,
    data,
    message,
  });
});
const readNotificationsHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, message, statusCode } =
    NotificationService.readNotifications(id);
  sendResponse({
    res,
    data,
    message,
    statusCode,
  });
});

router.get("/all-notification/:id", getAllNotificationByUser);
router.post("/read-all-notification/:id", readAllNotificationsHandler);
router.post("/read-notification/:id", readNotificationsHandler);
module.exports = router;
