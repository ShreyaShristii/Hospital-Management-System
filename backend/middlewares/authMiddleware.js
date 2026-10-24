const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../services/tokenService');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Not authorized to access this route', 401);

  const decoded = verifyToken(token);

  // Re-read role/active state so deactivation and role changes apply immediately.
  const user = await User.findById(decoded.id).select('role isActive').lean();
  if (!user || !user.isActive) throw new AppError('Not authorized to access this route', 401);

  req.user = { id: String(user._id), role: user.role };
  next();
});

module.exports = { protect };
