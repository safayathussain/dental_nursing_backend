const express = require("express");
const router = express.Router();

//routes

//middlewares
const authVerifyMiddleware = require("../middlewares/authMiddleware");

//routes
const authRoute = require("../modules/Auth/controller");
const userRoute = require("../modules/User/controller");
const categoryRoute = require("../modules/Category/controller");
const questionRoute = require("../modules/Question/controller");
const fileRoute = require("../modules/File/controller");
const commentRoute = require("../modules/Comment/controller");
const pollRoute = require("../modules/Poll/controller");
const blogRoute = require("../modules/Blog/controller");
const notificationRoute = require("../modules/Notification/controller");
const courseRoute = require("../modules/Course/controller");
const settingRoute = require("../modules/Setting/controller");
const contactRoute = require("../modules/Contact/controller");

//EndPoint

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/category", categoryRoute);
router.use("/question", questionRoute);
router.use("/file", fileRoute);
router.use("/comment", commentRoute);
router.use("/poll", pollRoute);
router.use("/blog", blogRoute);
router.use("/notification", notificationRoute);
router.use("/course", courseRoute);
router.use("/setting", settingRoute);
router.use("/contact", contactRoute);

router.use(authVerifyMiddleware);

module.exports = router;
