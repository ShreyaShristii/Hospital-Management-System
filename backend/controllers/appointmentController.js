const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const createNotification = require('../utils/notificationHelper')

const ensurePatientProfile = async (userId) => {
  let patient = await Patient.findOne({ userId });
  if (patient) return patient;

  // Backfill legacy patient users that were created without a Patient profile.
  patient = await Patient.create({
    userId,
    age: 0,
    gender: 'Other',
    emergencyContact: 'Not Provided',
    contactNumber: 'Not Provided',
    currentHealthStatus: 'Healthy',
    address: 'Not Provided',
    allergies: [],
  });

  return patient;
};

const addAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason } = req.body;
    const { role, id: userId } = req.user;

    let resolvedPatientId = patientId;
    if (role === 'patient') {
      const patient = await ensurePatientProfile(userId);
      resolvedPatientId = patient._id;
    }

    if (!resolvedPatientId || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const appointment = await Appointment.create({
      patientId: resolvedPatientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
    });

    // Notify patient
    try {
      const patient = await Patient.findById(resolvedPatientId).populate('userId', '_id name')
      if (patient?.userId) {
        await createNotification({
          userId: patient.userId._id,
          title: 'Appointment Booked',
          message: `Your appointment has been booked for ${new Date(appointmentDate).toLocaleDateString('en-IN')} at ${appointmentTime}`,
          type: 'Appointment',
          priority: 'Medium',
          relatedEntity: 'Appointment',
          relatedEntityId: appointment._id,
          actionUrl: '/appointments'
        })
      }
    } catch (e) {
      // Notification errors should not fail the appointment creation
      if (process.env.NODE_ENV !== 'production') {
        console.error('Notification error:', e.message);
      }
    }

    const populated = await Appointment.findById(appointment._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization' });

    res.status(201).json({ message: 'Appointment booked successfully', appointment: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const {
      search,
      status,
      date,
      sortBy = 'appointmentDate',
      order = 'desc',
      page = 1,
      limit = 10,
      all
    } = req.query;

    let filter = {};

    if (role === 'patient') {
      const patient = await ensurePatientProfile(userId);
      filter.patientId = patient._id;
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      filter.doctorId = doctor._id;
    }

    // Filter by status
    if (status) filter.status = status;

    // Filter by date (whole day range)
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.appointmentDate = { $gte: start, $lt: end };
    }

    const fetchAll = all === 'true';
    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = fetchAll ? 0 : (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);

    let query = Appointment.find(filter)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization' })
      .sort({ [sortBy]: sortOrder });

    if (!fetchAll) {
      query = query.skip(skip).limit(parseInt(limit));
    }

    let appointments = await query;

    // Post-populate search (by name, doctor, specialization, reason)
    if (search) {
      const s = search.toLowerCase();
      appointments = appointments.filter(apt =>
        apt.patientId?.userId?.name?.toLowerCase().includes(s) ||
        apt.doctorId?.userId?.name?.toLowerCase().includes(s) ||
        apt.doctorId?.specialization?.toLowerCase().includes(s) ||
        apt.reason?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      appointments,
      total,
      page: fetchAll ? 1 : parseInt(page),
      pages: fetchAll ? 1 : Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization degree consultationFee' });

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (role === 'patient') {
      const patient = await ensurePatientProfile(userId);
      if (!patient || appointment.patientId._id.toString() !== patient._id.toString())
        return res.status(403).json({ message: 'Access denied' });
    }

    if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString())
        return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Appointment not found' });

    if (role === 'patient') {
      const patient = await ensurePatientProfile(userId);
      if (!patient || existing.patientId.toString() !== patient._id.toString())
        return res.status(403).json({ message: 'Access denied' });
    }

    if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor || existing.doctorId.toString() !== doctor._id.toString())
        return res.status(403).json({ message: 'Access denied' });
      // Doctor can ONLY update status — strip everything else
      req.body = { status: req.body.status };
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    )
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization' });

    // Notify patient on status change
    try {
      if (req.body.status) {
        const patient = await Patient.findById(existing.patientId).populate('userId', '_id')
        if (patient?.userId) {
          await createNotification({
            userId: patient.userId._id,
            title: 'Appointment Updated',
            message: `Your appointment status has been updated to ${req.body.status}`,
            type: 'Appointment',
            priority: req.body.status === 'Cancelled' ? 'High' : 'Medium',
            relatedEntity: 'Appointment',
            relatedEntityId: existing._id,
            actionUrl: '/appointments'
          })
        }
      }
    } catch (e) {
      // Notification errors should not fail the appointment update
      if (process.env.NODE_ENV !== 'production') {
        console.error('Notification error:', e.message);
      }
    }

    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Appointment not found' });

    if (role === 'doctor')
      return res.status(403).json({ message: 'Doctors cannot delete appointments' });

    if (role === 'patient') {
      const patient = await ensurePatientProfile(userId);
      if (!patient || existing.patientId.toString() !== patient._id.toString())
        return res.status(403).json({ message: 'Access denied' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};