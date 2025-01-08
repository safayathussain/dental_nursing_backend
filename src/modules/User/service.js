const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model");
const { NotFound, BadRequest } = require("../../utility/errors");
const { useToken } = require("../../utility/common");

const getUsers = async ({
  limit = 10,
  page = 1,
  search = "",
  latest = "false",
}) => {
  limit = Math.max(1, parseInt(limit, 10));
  page = Math.max(1, parseInt(page, 10));

  const query = {};
  if (search) {
    query.$or = [{ email: { $regex: search, $options: "i" } }];
  }
  const isLatest = latest.toLowerCase() === "true";
  const sortOption = isLatest ? { createdAt: -1 } : {};
  const users = await User.find(query)
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalCount = await User.countDocuments(query);

  return {
    data: {
      data: users,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
const getUserByFirebaseId = async (id, res) => {
  const user = await User.findOne({ firebaseUid: id }).lean();
  if (!user) return { message: "User not found", statusCode: 404 };
  const { accessToken, refreshToken } = useToken({
    res,
    payload: {
      email: user.email,
      _id: user._id,
      role: user.role,
      name: user.name,
      profilePicture: user.profilePicture,
    },
  });
  return { data: { ...user, accessToken } };
};

module.exports = {
  getUserByFirebaseId,
  getUsers,
};
