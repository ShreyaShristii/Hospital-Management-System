const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient', 'receptionist', 'nurse', 'lab_staff', 'pharmacist'],
    required: true,
  },
  dateOfJoining: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  phone: { type: String, trim: true, maxlength: 20 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
