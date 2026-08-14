const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract the first error message or join them
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ApiError(400, errorMessages);
  }
  next();
};

module.exports = { validate };
