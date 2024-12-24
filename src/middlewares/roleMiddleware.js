const { BASIC_USER, ADMIN } = require("../config/constant");
const { Unauthorized } = require("../utility/errors");

module.exports = (roles) => (req, res, next) => {
  const userRole = req.role; // Retrieve role from req object
  if (!roles.includes(userRole) && !roles.includes(BASIC_USER, ADMIN)) {
    throw new Unauthorized("You dont have permissions for this action");
  }
  next();
};
