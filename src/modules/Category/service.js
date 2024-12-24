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

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
};
