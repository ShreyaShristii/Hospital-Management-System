const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  items: [
    {
      name: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
    },
  ],
  amount: { type: Number, required: true, min: 0 },
  paymentMode: { type: String, enum: ['Cash', 'Card', 'UPI', 'Online'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
  paymentDate: { type: Date },
  razorpayOrderId: { type: String, index: true, sparse: true },
  razorpayPaymentId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
