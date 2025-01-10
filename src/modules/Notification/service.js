const NotificationModel = require("./model");

const readAllNotifications = async (id) => {
  const updatedNotifications = await NotificationModel.updateMany(
    { sendTo: id },
    { $set: { readStatus: true } }
  );
  if (updatedNotifications.nModified === 0) {
    return {
      statusCode: 404,
      message: "No notifications to update",
      success: false,
    };
  }
  return {
    statusCode: 200,
    message: "All notifications marked as read",
    success: true,
  };
};
const readNotifications = async (id) => {
  const updatedNotifications = await NotificationModel.findByIdAndUpdate(id, {
    $set: { readStatus: true },
  });
  if (!updatedNotifications) {
    return {
      message: "Notification not found",
      success: false,
      statusCode: 404
    };
  }
  return {
    statusCode: 200,
    message: "Notification marked as read",
    success: true,
  };
};

module.exports = {
  readAllNotifications,
  readNotifications,
};
