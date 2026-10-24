const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  logger.info('MongoDB connected');
};

module.exports = connectDB;
