const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const createPollSchema = Joi.object({
  options: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().required().messages({
          "any.required": "Option value is required",
          "string.base": "Option value must be a string",
        }),
        voteCount: Joi.number().default(0).min(0).messages({
          "number.base": "Vote count must be a number",
          "number.min": "Vote count must be at least 0",
        }),
      })
    )
    .min(2)
    .required()
    .messages({
      "array.base": "Options must be an array",
      "array.min": "At least two options are required",
      "any.required": "Options are required",
    }),

  content: Joi.string().required().messages({
    "any.required": "Content is required",
    "string.base": "Content must be a string",
  }),

  votedCount: Joi.number().default(0).min(0).messages({
    "number.base": "Voted count must be a number",
    "number.min": "Voted count must be at least 0",
  }),

  userId: Joi.objectId().required().messages({
    "any.required": "User ID is required",
    "objectId.base": "User ID must be a valid ObjectId",
  }),
});

const createPollValidate = (data) => {
  const result = createPollSchema.validate(data, { abortEarly: false });
  result.value = data; 
  return result;
};

module.exports = {
  createPollValidate,
};
