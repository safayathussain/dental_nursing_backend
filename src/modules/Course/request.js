const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Define the validation schema for Blog
const createCourseSchema = Joi.object().keys({
  description: Joi.string().required().messages({
    "any.required": "Description is required",
    "string.base": "Description must be a string",
  }),
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.base": "Title must be a string",
  }),
  url: Joi.string().required().messages({
    "any.required": "Url is required",
    "string.base": "Url must be a string",
  }),
  thumbnail: Joi.string().required().messages({
    "any.required": "Thumbnail is required",
    "string.base": "Thumbnail must be a string",
  }),
  userId: Joi.objectId().required().messages({
    "any.required": "User ID is required",
    "objectId.base": "User ID must be a valid ObjectId",
  }),
});

// Function to validate data
const createCourseValidate = (data) => {
  const result = createCourseSchema.validate(data, { abortEarly: false });
  result.value = data;
  return result;
};

module.exports = {
  createCourseValidate,
};
