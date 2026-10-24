const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validate');

router.use(protect);

router.post('/create-order',
  authorize('patient', 'receptionist', 'admin'),
  body('billId').isMongoId().withMessage('Valid billId is required'),
  validate,
  createOrder);

router.post('/verify',
  authorize('patient', 'receptionist', 'admin'),
  body('razorpay_order_id').isString().notEmpty(),
  body('razorpay_payment_id').isString().notEmpty(),
  body('razorpay_signature').isString().notEmpty(),
  validate,
  verifyPayment);

module.exports = router;
