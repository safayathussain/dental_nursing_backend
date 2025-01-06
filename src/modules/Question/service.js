const { default: mongoose } = require("mongoose");
const { NotFound, BadRequest } = require("../../utility/errors");
const QuestionModel = require("./model");
const CategoryModel = require("../Category/model");

const createQuestion = async ({ content, title, userId, categories }) => {
  const question = await QuestionModel.create({
    content,
    title,
    userId,
    categories,
  });
  await Promise.all(
    categories.map((item) =>
      CategoryModel.findByIdAndUpdate(item, { $inc: { questionsCount: 1 } })
    )
  );
  return { data: question, message: "Question posted successfully" };
};

const deleteQuestion = async (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question Not found", success: false };
  }
  const question = await QuestionModel.findOneAndDelete({ _id: id });
  if (!question) {
    return {
      statusCode: 404,
      message: "Question Not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Question deleted successfully",
  };
};
const likeQuestion = async (req, id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question Not found", success: false };
  }
  const question = await QuestionModel.findByIdAndUpdate(id, {
    $addToSet: { likedUser: req._id },
  });
  if (!question) {
    return {
      statusCode: 404,
      message: "Question Not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Question liked successfully",
  };
};
const dislikeQuestion = async (req, id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question Not found", success: false };
  }
  const question = await QuestionModel.findByIdAndUpdate(id, {
    $pull: { likedUser: req._id },
  });
  if (!question) {
    return {
      statusCode: 404,
      message: "Question Not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Question disliked successfully",
  };
};
const getQuestions = async ({
  limit = 10,
  page = 1,
  search = "",
  category = [],
  latest = "false",
}) => {
  limit = Math.max(1, parseInt(limit, 10));
  page = Math.max(1, parseInt(page, 10));
  category = category.length && JSON.parse(category);

  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }
  if (Array.isArray(category) && category.length) {
    query.categories = { $in: category };
  }
  const isLatest = latest.toLowerCase() === "true";
  const sortOption = isLatest ? { createdAt: -1 } : {};
  const questions = await QuestionModel.find(query)
    .populate("userId", "name email profilePicture")
    .populate("categories", "name")
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalCount = await QuestionModel.countDocuments(query);

  return {
    data: {
      data: questions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const getSingleQuestion = async (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question Not found", success: false };
  }
  const question = await QuestionModel.findById(id)
    .lean()
    .populate("userId", "name email profilePicture")
    .populate("categories", "name");
  if (!question) {
    return { message: "Question not found", statusCode: 404, success: false };
  }
  return { data: { question } };
};
module.exports = {
  createQuestion,
  deleteQuestion,
  getQuestions,
  getSingleQuestion,
  likeQuestion,
  dislikeQuestion,
};
