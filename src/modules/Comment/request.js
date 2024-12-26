const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Define the validation schema for Comment
const createCommentSchema = Joi.object({
  postId: Joi.objectId().required().messages({
    "any.required": "Post ID is required",
    "objectId.base": "Post ID must be a valid ObjectId",
  }),

  parentId: Joi.objectId().optional().allow(null).messages({
    "objectId.base": "Parent ID must be a valid ObjectId or null",
  }),
  rootCommentId: Joi.objectId().optional().allow(null).messages({
    "objectId.base": "Root Comment ID must be a valid ObjectId or null",
  }),

  likedUser: Joi.array().items(Joi.objectId()).default([]).messages({
    "array.base": "Liked users must be an array of ObjectIds",
    "array.includes": "Each liked user must be a valid ObjectId",
  }),

  reportedUser: Joi.array().items(Joi.objectId()).default([]).messages({
    "array.base": "Reported users must be an array of ObjectIds",
    "array.includes": "Each reported user must be a valid ObjectId",
  }),

  content: Joi.string().required().messages({
    "any.required": "Content is required",
    "string.base": "Content must be a string",
  }),

  userId: Joi.objectId().required().messages({
    "any.required": "User ID is required",
    "objectId.base": "User ID must be a valid ObjectId",
  }),

  postType: Joi.string().valid("Blog", "Question", "Poll").required().messages({
    "any.required": "Post type is required",
    "string.base": "Post type must be a string",
    "any.only": 'Post type must be either "Blog" or "Question"',
  }),

  childrensCount: Joi.number().default(0).min(0).messages({
    "number.base": "Children count must be a number",
    "number.min": "Children count must be at least 0",
  }),
});

// Function to validate data
const createCommentValidate = (data) => {
  const result = createCommentSchema.validate(data, { abortEarly: false });
  result.value = data; // Attach the original data to the validation result
  return result;
};

module.exports = {
  createCommentValidate,
};
