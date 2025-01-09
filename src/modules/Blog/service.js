const { default: mongoose } = require("mongoose");
const { NotFound, BadRequest } = require("../../utility/errors");
const BlogModel = require("./model");
const CategoryModel = require("../Category/model");

const createBlog = async ({ content, title, userId, categories, tags, thumbnail }) => {
  const blog = await BlogModel.create({
    content,
    title,
    userId,
    categories,
    tags,
    thumbnail
  });
  await Promise.all(
    categories?.map((item) =>
      CategoryModel.findByIdAndUpdate(item, { $inc: { blogsCount: 1 } })
    )
  );
  return { data: blog, message: "Blog published successfully" };
};
const editBlog = async ({ content, title, userId, categories, tags, id, thumbnail }) => {
  console.log(title);
  const blog = await BlogModel.findByIdAndUpdate(id, {
    content,
    title,
    userId,
    categories,
    tags,
    thumbnail
  });
  return { data: blog, message: "Blog edited successfully" };
};

const deleteBlog = async (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Blog Not found", success: false };
  }
  const question = await BlogModel.findOneAndDelete({ _id: id });
  if (!question) {
    return {
      statusCode: 404,
      message: "Blog Not found",
      success: false,
    };
  }
  return {
    data: question,
    message: "Blog deleted successfully",
  };
};
const getBlogs = async ({
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
    query.$or = [{ title: { $regex: search, $options: "i" } }];
  }
  if (Array.isArray(category) && category.length) {
    query.categories = { $in: category };
  }
  const isLatest = latest.toLowerCase() === "true";
  const sortOption = isLatest ? { createdAt: -1 } : {};
  const questions = await BlogModel.find(query)
    .populate("userId", "name email profilePicture")
    .populate("categories", "name")
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalCount = await BlogModel.countDocuments(query);

  return {
    data: {
      data: questions,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const getSingleBlog = async (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Blog Not found", success: false };
  }
  const question = await BlogModel.findById(id)
    .lean()
    .populate("userId", "name email profilePicture")
    .populate("categories", "name");
  if (!question) {
    return { message: "Blog not found", statusCode: 404, success: false };
  }
  return { data: { question } };
};
module.exports = {
  createBlog,
  deleteBlog,
  getBlogs,
  getSingleBlog,
  editBlog,
};
