const Razorpay = require('razorpay')
const crypto = require('crypto')
const Bill = require('../models/Bill')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Step 1 — Create Razorpay order
const createOrder = async (req, res) => {
  try {
    const { billId } = req.body

    const bill = await Bill.findById(billId)
    if (!bill) return res.status(404).json({ message: 'Bill not found' })
    if (bill.paymentStatus === 'Paid')
      return res.status(400).json({ message: 'Bill is already paid' })

    const options = {
      amount: Math.round(bill.amount * 100), // Razorpay needs paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: `bill_${billId}`,
      notes: { billId: billId.toString() },
    }

    const order = await razorpay.orders.create(options)

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      billId,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Step 2 — Verify payment signature and mark bill as Paid
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId } = req.body

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    // Update bill to Paid
    const bill = await Bill.findByIdAndUpdate(
      billId,
      {
        paymentStatus: 'Paid',
        paymentMode: 'Online',
        paymentDate: new Date(),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    )
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization' })

    res.status(200).json({ message: 'Payment successful', bill })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createOrder, verifyPayment }