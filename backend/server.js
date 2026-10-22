require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Trust proxy - important for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true,
});

// CORS configuration - restrict to specific domains only
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.PROD_CLIENT_URL || 'https://hospital-management-system-sigma-three.vercel.app'
    ]
  : [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow if in whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Otherwise, deny
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint (no auth needed)
app.get('/', (req, res) => {
  res.json({ message: 'HMS API is running...' });
});

// Apply stricter rate limiting to auth endpoints
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const departmentRoutes = require('./routes/departmentRoutes');
app.use('/api/departments', departmentRoutes);

const billRoutes = require('./routes/billRoutes');
app.use('/api/bills', billRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
 app.use('/api/appointments', appointmentRoutes);

 const addmissionRoutes = require('./routes/addmissionRoutes');
 app.use('/api/admissions', addmissionRoutes);

 const bedRoutes = require('./routes/bedRoutes');
 app.use('/api/beds', bedRoutes);

 const emrRoutes = require('./routes/emrRoutes');
app.use('/api/emrs', emrRoutes);

 const labRoutes = require('./routes/labRoutes');
 app.use('/api/labs', labRoutes);

 const pharmacyRoutes = require('./routes/pharmacyRoutes');
 app.use('/api/pharmacy', pharmacyRoutes);


 const staffRoutes = require('./routes/staffRoutes');
 app.use('/api/staff', staffRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

// const notificationRoutes = require('./routes/notificationRoutes');
//  app.use('/api/notifications', notificationRoutes);
 
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Don't expose error details in production
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(statusCode).json({
    message: isDevelopment ? err.message : 'An error occurred. Please try again later.',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Server terminated');
    }
  });
});

