const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Define the validation schema for Blog
const createBlogSchema = Joi.object().keys({
  content: Joi.string().required().messages({
    "any.required": "Content is required",
    "string.base": "Content must be a string",
  }),
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.base": "Title must be a string",
  }),
  thumbnail: Joi.string().required().messages({
    "any.required": "Thumbnail is required",
    "string.base": "Thumbnail must be a string",
  }),
  userId: Joi.objectId().required().messages({
    "any.required": "User ID is required",
    "objectId.base": "User ID must be a valid ObjectId",
  }),
  categories: Joi.array().items(Joi.objectId()).default([]).messages({
    "array.base": "Categories must be an array of ObjectIds",
  }),
  likedUser: Joi.array().items(Joi.objectId()).default([]).messages({
    "array.base": "Liked users must be an array of ObjectIds",
  }),
  tags: Joi.array().items(String).default([]).messages({
    "array.base": "Tags must be an array of String",
  }),
  commentsCount: Joi.number().default(0).messages({
    "number.base": "Comments count must be a number",
  }),
});

// Function to validate data
const createBlogValidate = (data) => {
  const result = createBlogSchema.validate(data, { abortEarly: false });
  result.value = data;
  return result;
};

module.exports = {
  createBlogValidate,
};
