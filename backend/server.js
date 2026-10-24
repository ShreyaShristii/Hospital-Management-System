require('dotenv').config();

const mongoose = require('mongoose');
const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

validateEnv();

const app = require('./app');

const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => logger.info({ port: PORT }, 'Server listening'));

  const shutdown = (signal) => {
    logger.info({ signal }, 'Shutting down');
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

process.on('unhandledRejection', (reason) => logger.error({ err: reason }, 'Unhandled rejection'));

start().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
