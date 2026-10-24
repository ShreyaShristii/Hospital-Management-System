const express = require('express');
const mongoose = require('mongoose');
const { validateObjectId } = require('../middlewares/validate');

const router = express.Router();

router.get('/health', (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    db: dbUp ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

const mounts = {
  '/auth': './authRoutes',
  '/payments': './paymentRoutes',
  '/patients': './patientRoutes',
  '/doctors': './doctorRoutes',
  '/departments': './departmentRoutes',
  '/bills': './billRoutes',
  '/appointments': './appointmentRoutes',
  '/admissions': './addmissionRoutes',
  '/beds': './bedRoutes',
  '/emrs': './emrRoutes',
  '/labs': './labRoutes',
  '/pharmacy': './pharmacyRoutes',
  '/staff': './staffRoutes',
  '/reviews': './reviewRoutes',
  '/notifications': './notificationRoutes',
};

const idParams = ['id', 'patientId', 'doctorId', 'staffId', 'departmentId'];

Object.entries(mounts).forEach(([path, file]) => {
  const sub = require(file);
  idParams.forEach((p) => sub.param(p, validateObjectId));
  router.use(path, sub);
});

module.exports = router;
