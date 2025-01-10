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
    categories?.map((item) =>
      CategoryModel.findByIdAndUpdate(item, { $inc: { questionsCount: 1 } })
    )
  );
  return { data: question, message: "Question posted" };
};

const deleteQuestion = async (id, userId) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question not found", success: false };
  }
  const question = await QuestionModel.findById(id);
  if (!question) {
    return {
      statusCode: 404,
      message: "Question not found",
      success: false,
    };
  }
  if (userId !== question.userId.toString() && userId.role !== "AD") {
    return {
      statusCode: 403,
      message: "You can’t delete this question",
      success: false,
    };
  }
  const deletedQuestion = await QuestionModel.findByIdAndDelete(id);
  return {
    data: deletedQuestion,
    message: "Question deleted",
    success: true,
  };
};

const likeQuestion = async (req, id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question not found", success: false };
  }
  const question = await QuestionModel.findByIdAndUpdate(id, {
    $addToSet: { likedUser: req._id },
  });
  if (!question) {
    return {
      statusCode: 404,
      message: "Question not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Question liked",
  };
};
const dislikeQuestion = async (req, id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Question not found", success: false };
  }
  const question = await QuestionModel.findByIdAndUpdate(id, {
    $pull: { likedUser: req._id },
  });
  if (!question) {
    return {
      statusCode: 404,
      message: "Question not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Question disliked",
  };
};
const getQuestions = async ({
  limit = 10,
  page = 1,
  search = "",
  category = [],
  latest = "false",
  userId = null,
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
  if (userId) {
    query.userId = userId;
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
    return { statusCode: 404, message: "Question not found", success: false };
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
