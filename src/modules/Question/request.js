const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Define the validation schema for Question
const createQuestionSchema = Joi.object().keys({
  content: Joi.string().required().messages({
    'any.required': 'Content is required',
    'string.base': 'Content must be a string',
  }),
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.base': 'Title must be a string',
  }),
  userId: Joi.objectId().required().messages({
    'any.required': 'User ID is required',
    'objectId.base': 'User ID must be a valid ObjectId',
  }),
  categories: Joi.array().items(Joi.objectId()).default([]).messages({
    'array.base': 'Categories must be an array of ObjectIds',
  }),
  likedUser: Joi.array().items(Joi.objectId()).default([]).messages({
    'array.base': 'Liked users must be an array of ObjectIds',
  }),
  reportedUser: Joi.array().items(Joi.objectId()).default([]).messages({
    'array.base': 'Reported users must be an array of ObjectIds',
  }),
  commentsCount: Joi.number().default(0).messages({
    'number.base': 'Comments count must be a number',
  }),
});

// Function to validate data
const createQuestionValidate = (data) => {
  const result = createQuestionSchema.validate(data, { abortEarly: false });
  result.value = data;
  return result;
};

module.exports = {
  createQuestionValidate,
};
