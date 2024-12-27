const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Define the validation schema for creating a user
const createUserSchema = Joi.object().keys({
  name: Joi.string().required().messages({
    'any.required': 'Name is required', 
    'string.base': 'Name must be a string'
  }),
  profilePicture: Joi.string().optional().messages({
    'string.base': 'profilePicture must be a string'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address'
  }),
  role: Joi.string().valid('AD', 'BU').required().messages({
    'any.required': 'Role is required',
    'string.base': 'Role must be a string',
    'any.only': 'Role must be either "AD" or "BU"'
  }),
  firebaseUid: Joi.string().required().messages({
    'any.required': 'firebaseUid is required',
    'string.base': 'firebaseUid must be a string'
  }),
});

const createUserValidate = (data) => {
  const result = createUserSchema.validate(data, { abortEarly: false });
  result.value = data;  
  return result;
};

module.exports = {
  createUserValidate,
};
