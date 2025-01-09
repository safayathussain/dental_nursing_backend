const { default: mongoose } = require("mongoose");
const { NotFound, BadRequest } = require("../../utility/errors");
const CourseModel = require("./model");

const createCourse = async ({ description, title, userId, url, thumbnail }) => {
  const blog = await CourseModel.create({
    description,
    title,
    userId,
    url,
    thumbnail,
  });
  return { data: blog, message: "Course published successfully" };
};
const editCourse = async ({
  description,
  title,
  userId,
  url,
  id,
  thumbnail,
}) => {
  const blog = await CourseModel.findByIdAndUpdate(id, {
    description,
    title,
    userId,
    url,
    thumbnail,
  });
  return { data: blog, message: "Course edited successfully" };
};

const deleteCourse = async (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Course Not found", success: false };
  }
  const question = await CourseModel.findOneAndDelete({ _id: id });
  if (!question) {
    return {
      statusCode: 404,
      message: "Course Not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Course deleted successfully",
  };
};
const getCourses = async ({
  limit = 10,
  page = 1,
  search = "",
  latest = "false",
}) => {
  limit = Math.max(1, parseInt(limit, 10));
  page = Math.max(1, parseInt(page, 10));

  const query = {};
  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }];
  }
  const isLatest = latest.toLowerCase() === "true";
  const sortOption = isLatest ? { createdAt: -1 } : {};
  const courses = await CourseModel.find(query)
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalCount = await CourseModel.countDocuments(query);

  return {
    data: {
      data: courses,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
 
module.exports = {
  createCourse,
  deleteCourse,
  getCourses, 
  editCourse,
};
