const jwt = require('jsonwebtoken');

const ALGORITHM = 'HS256';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, { algorithms: [ALGORITHM] });

module.exports = { signToken, verifyToken };
