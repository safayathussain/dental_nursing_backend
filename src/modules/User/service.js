const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model");
const { NotFound, BadRequest } = require("../../utility/errors");
const { useToken } = require("../../utility/common");

//getAllUser

const getUserByFirebaseId = async (id, res) => {
  const user = await User.findOne({ firebaseUid: id }).lean();
  const { accessToken, refreshToken } = useToken({
    res,
    payload: {
      email: user.email,
      _id: user._id,
      role: user.role,
    },
  });
  return { data: { ...user, accessToken } };
};

module.exports = {
  getUserByFirebaseId,
};
