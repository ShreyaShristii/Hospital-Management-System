const logger = require('../utils/logger');

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
};

// Maps library errors to HTTP statuses so controllers can just throw or call next(err).
const normalize = (err) => {
  if (err.name === 'CastError') return { statusCode: 400, message: `Invalid ${err.path}` };
  if (err.name === 'ValidationError' && err.errors) {
    return { statusCode: 400, message: 'Validation failed', details: Object.values(err.errors).map((e) => e.message) };
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return { statusCode: 409, message: `Duplicate ${field}` };
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return { statusCode: 401, message: 'Not authorized to access this route' };
  }
  if (err.type === 'entity.parse.failed') return { statusCode: 400, message: 'Malformed JSON body' };
  if (err.type === 'entity.too.large') return { statusCode: 413, message: 'Request body too large' };
  return null;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const mapped = normalize(err);
  const statusCode = mapped?.statusCode || err.statusCode || 500;
  const isServerError = statusCode >= 500;

  const log = req.log || logger;
  if (isServerError) log.error({ err }, 'Unhandled error');

  const message = isServerError && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : mapped?.message || err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...((mapped?.details || err.details) && { details: mapped?.details || err.details }),
    ...(process.env.NODE_ENV !== 'production' && isServerError && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
