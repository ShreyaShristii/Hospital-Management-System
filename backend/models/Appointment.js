const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: {
    type: String,
    required: true,
    match: [/^([01]?\d|2[0-3]):[0-5]\d(\s?[AaPp][Mm])?$/, 'Time must look like 14:30 or 2:30 PM'],
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled',
  },
  reason: { type: String, required: true, trim: true, maxlength: 500 },
}, { timestamps: true });

appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
// Race-free double-booking guard: one active booking per doctor slot.
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true, partialFilterExpression: { status: 'Scheduled' } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
