const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  previousRecords: { type: String, default: 'None' },
  emergencyContact: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  currentHealthStatus: { type: String, default: 'Healthy' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String, match: [/^(A|B|AB|O)[+-]$/, 'Invalid blood group'] },
  allergies: { type: [String], default: [] },
  address: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
