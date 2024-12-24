const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utility/response");
module.exports = (req, res, next) => {
  const token = req?.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendResponse({
      res,
      statusCode: 401,
      message: "You need to login",
      success: false,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return sendResponse({
        res,
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    // Add decoded data to the request object
    req.email = decoded.email;
    req.role = decoded.role;
    req._id = decoded._id;
    // Proceed to the next middleware or route handler
    next();
  });
};
