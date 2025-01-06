const { NotFound, BadRequest } = require("../../utility/errors");
const CategoryModel = require("./model");

const createCategory = async (name) => {
  const existedCategory = await CategoryModel.findOne({ name: name });
  if (existedCategory) {
    return {
      statusCode: 500,
      message: "Category already exists",
      success: false,
    };
  }
  const category = await CategoryModel.create({
    name: name,
  });
  return { data: category, message: "Category added successfully" };
};
const updateCategory = async (name, id) => {
  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { _id: id },
    {
      name,
    }
  );
  if (!updatedCategory) {
    return {
      statusCode: 404,
      message: "Category Not found",
      success: false,
    };
  }
  return { data: updatedCategory, message: "Category updated successfully" };
};
const deleteCategory = async (id) => {
  const category = await CategoryModel.findOneAndDelete({ _id: id });
  if (!category) {
    return {
      statusCode: 404,
      message: "Category Not found",
      success: false,
    };
  }
  return {
    data: category,
    message: "Category deleted successfully",
  };
};

const getCategories = async ({
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
      { name: { $regex: search, $options: "i" } },
    ];
  }
  const isLatest = latest.toLowerCase() === "true";
  const sortOption = isLatest ? { createdAt: -1 } : {};
  const categories = await CategoryModel.find(query)
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalCount = await CategoryModel.countDocuments(query);

  return {
    data: {
      data: categories,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories
};
