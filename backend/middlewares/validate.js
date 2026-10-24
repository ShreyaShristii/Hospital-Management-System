const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return next(new AppError('Validation failed', 400, details));
};

// Use with router.param('id', validateObjectId) to reject malformed ids before hitting Mongo.
const validateObjectId = (req, res, next, value, name) => {
  if (!mongoose.isValidObjectId(value)) return next(new AppError(`Invalid ${name}`, 400));
  return next();
};

// Drops any body key not in the allowlist (mass-assignment protection).
const pickBody = (...fields) => (req, res, next) => {
  req.body = Object.fromEntries(Object.entries(req.body || {}).filter(([k]) => fields.includes(k)));
  next();
};

module.exports = { validate, validateObjectId, pickBody };
