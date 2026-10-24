const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.set('trust proxy', 1);

app.use(pinoHttp({ logger, genReqId: (req) => req.headers['x-request-id'] || require('crypto').randomUUID() }));
app.use(helmet());
app.use(compression());

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.PROD_CLIENT_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new AppError('Origin not allowed by CORS policy', 403));
  },
  credentials: true,
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));
app.use(mongoSanitize());

const rateLimitHandler = (message) => (req, res) =>
  res.status(429).json({ success: false, message });

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests from this IP, please try again later.'),
  skip: (req) => req.path === '/api/health',
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  handler: rateLimitHandler('Too many login attempts, please try again after 15 minutes.'),
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/', (req, res) => res.json({ message: 'HMS API is running...' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
