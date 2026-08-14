const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
