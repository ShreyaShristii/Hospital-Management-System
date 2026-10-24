const Razorpay = require('razorpay');
const crypto = require('crypto');
const Bill = require('../models/Bill');
const Patient = require('../models/Patient');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

let razorpayClient;
const getRazorpay = () => {
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
};

const assertCanPay = async (bill, user) => {
  if (user.role !== 'patient') return;
  const patient = await Patient.findOne({ userId: user.id }).select('_id').lean();
  if (!patient || String(bill.patientId) !== String(patient._id)) {
    throw new AppError('Access denied', 403);
  }
};

const signaturesMatch = (expected, received) => {
  const a = Buffer.from(expected);
  const b = Buffer.from(String(received || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Step 1: create an order and bind it to the bill server-side.
const createOrder = asyncHandler(async (req, res) => {
  const { billId } = req.body;

  const bill = await Bill.findById(billId);
  if (!bill) throw new AppError('Bill not found', 404);
  if (bill.paymentStatus === 'Paid') throw new AppError('Bill is already paid', 400);
  await assertCanPay(bill, req.user);

  const order = await getRazorpay().orders.create({
    amount: Math.round(bill.amount * 100),
    currency: 'INR',
    receipt: `bill_${bill._id}`,
    notes: { billId: String(bill._id) },
  });

  bill.razorpayOrderId = order.id;
  await bill.save({ validateModifiedOnly: true });

  res.status(200).json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    billId: bill._id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// Step 2: the bill is resolved from the stored order id, never from client-supplied billId.
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (!signaturesMatch(expected, razorpay_signature)) {
    throw new AppError('Payment verification failed', 400);
  }

  const bill = await Bill.findOne({ razorpayOrderId: razorpay_order_id });
  if (!bill) throw new AppError('Order not found', 404);
  await assertCanPay(bill, req.user);

  // Idempotent: a replayed verification returns the existing result.
  if (bill.paymentStatus !== 'Paid') {
    bill.paymentStatus = 'Paid';
    bill.paymentMode = 'Online';
    bill.paymentDate = new Date();
    bill.razorpayPaymentId = razorpay_payment_id;
    await bill.save({ validateModifiedOnly: true });
  }

  const populated = await Bill.findById(bill._id)
    .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
    .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization' });

  res.status(200).json({ message: 'Payment successful', bill: populated });
});

module.exports = { createOrder, verifyPayment };
