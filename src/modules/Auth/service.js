const { BadRequest } = require("../../utility/errors");
const { generateOTP, useToken } = require("../../utility/common");
const UserModel = require("../User/model");
const { admin, auth } = require("../../utility/firebase");
const jwt = require("jsonwebtoken");
const { sendEmail, getOtpEmailTamplate } = require("../../utility/email");
const { default: mongoose } = require("mongoose");
const UserRegister = async (
  email,
  name,
  role,
  profilePicture,
  firebaseUid,
  provider,
  res
) => {
  try {
    const otp = generateOTP();
    const existedUser = await UserModel.findOne({ email: email }).lean();
    if (existedUser) {
      if (!provider) {
        return {
          statusCode: 400,
          success: false,
          message: "This user already exists",
        };
      } else {
        const { accessToken, refreshToken } = useToken({
          res,
          payload: {
            email: existedUser.email,
            _id: existedUser._id,
            name: existedUser.name,
            role: existedUser.role,
            profilePicture: existedUser.profilePicture,
          },
        });
        return { data: { ...existedUser, accessToken } };
      }
    }
    const user = new UserModel({
      name,
      email,
      firebaseUid,
      profilePicture,
      role: role ? role : "BU",
      isVerified: provider || role === "AD" ? true : false,
      otp: !provider ? otp : null,
    });
    await user.save();
    if (!provider) {
      sendEmail(email, "subject", getOtpEmailTamplate(otp));

      return { message: "Check your email for the OTP." };
    } else {
      const { accessToken, refreshToken } = useToken({
        res,
        payload: {
          email: user.email,
          name: user.name,
          _id: user._id,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
      return {
        data: { ...user.toObject(), accessToken },
        message: "You’ve been registered successfully",
      };
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest("Failed to register user.");
  }
};
const VerifyOtp = async (email, otp, res) => {
  try {
    const user = await UserModel.findOne({ email }).select("+otp");
    if (user.otp === otp) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { $set: { isVerfied: true, otp: null } },
        { new: true }
      );
      const { accessToken, refreshToken } = useToken({
        res,
        payload: {
          email: updatedUser.email,
          _id: updatedUser._id,
          name: updatedUser.name,
          role: updatedUser.role,
          profilePicture: updatedUser.profilePicture,
        },
      });
      return {
        data: { ...updatedUser.toObject(), accessToken },
        message: "OTP verified successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "The OTP doesn’t match",
        success: false,
      };
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest("Failed to verify otp.");
  }
};
const sendOtp = async (email) => {
  try {
    const otp = generateOTP();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { message: "User not found", statusCode: 404, success: false };
    }
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { otp } },
      { new: true }
    );

    sendEmail(email, "subject", getOtpEmailTamplate(otp));

    return { message: "Check your email for the OTP." };
  } catch (error) {
    console.error(error);
    throw new BadRequest("Failed to send otp.");
  }
};
const setPassword = async (email, password, res) => {
  try {
    const user = await auth.getUserByEmail(email);
    const updatedUser = await admin.auth().updateUser(user.uid, {
      password: password,
    });
    const mongoUser = await UserModel.findOne({ email: email }).lean();
    const { accessToken, refreshToken } = useToken({
      res,
      payload: {
        email: mongoUser.email,
        _id: mongoUser._id,
        name: mongoUser.name,
        role: mongoUser.role,
        profilePicture: mongoUser.profilePicture,
      },
    });
    return { data: { ...mongoUser, accessToken }, message: "Password updated" };
  } catch (error) {
    if (error.message) {
      return { message: error.message, success: false, statusCode: 500 };
    }
    console.error(error);
    throw new BadRequest("Failed to set password.");
  }
};
const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decoded._id);
    const newAccessToken = jwt.sign(
      {
        email: decoded.email,
        _id: decoded._id,
        role: decoded.role,
        name: user.name,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    return { data: newAccessToken };
  } catch (error) {
    if (error.message) {
      return { message: error.message, success: false, statusCode: 500 };
    }
    throw new BadRequest("Failed to get token.");
  }
};
const editProfile = async (id, data, userId) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return { statusCode: 404, message: "User not found", success: false };
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
        success: false,
      };
    }
    if (userId !== user._id.toString() && userId.role !== "AD") {
      return {
        statusCode: 403,
        message: "You don’t have permission to edit this profile",
        success: false,
      };
    }
    const updatedData = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    const accessToken = jwt.sign(
      {
        email: updatedData.email,
        _id: updatedData._id,
        role: updatedData.role,
        name: updatedData.name,
        profilePicture: updatedData.profilePicture,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    return {
      data: { ...updatedData.toObject(), accessToken },
      message: "Profile updated",
      success: true,
    };
  } catch (error) {
    return {
      message: error.message || "Failed to update profile",
      success: false,
      statusCode: 500,
    };
  }
};

module.exports = {
  UserRegister,
  VerifyOtp,
  sendOtp,
  setPassword,
  refreshToken,
  editProfile,
};
