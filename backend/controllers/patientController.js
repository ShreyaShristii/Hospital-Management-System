const escapeRegex = require('../utils/escapeRegex');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const PATIENT_EDITABLE_FIELDS = [
  'age', 'gender', 'bloodGroup', 'allergies', 'address',
  'emergencyContact', 'contactNumber', 'currentHealthStatus', 'previousRecords',
];

// Get current user's patient profile
const getMyProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id }).populate('userId', 'name email phone role');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

// Add new patient
const addPatient = async (req, res, next) => {
  try {
    const { userId, userEmail, age, gender, bloodGroup, allergies, address, emergencyContact, contactNumber, currentHealthStatus } = req.body;

    let resolvedUserId = userId;

    if (!resolvedUserId && userEmail) {
      const user = await User.findOne({ email: userEmail.toLowerCase() }).select('_id role');
      if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
      }
      if (user.role !== 'patient') {
        return res.status(400).json({ message: 'Selected user is not a patient account' });
      }
      resolvedUserId = user._id;
    }

    if (!resolvedUserId) {
      return res.status(400).json({ message: 'Patient account is required' });
    }

    const linkedUser = await User.findById(resolvedUserId).select('_id role');
    if (!linkedUser) {
      return res.status(404).json({ message: 'Patient account not found' });
    }
    if (linkedUser.role !== 'patient') {
      return res.status(400).json({ message: 'Selected account must have patient role' });
    }

    const patientExists = await Patient.findOne({ userId: resolvedUserId });
    if (patientExists) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const patient = await Patient.create({
      userId: resolvedUserId,
      age,
      gender,
      bloodGroup,
      allergies,
      address,
      emergencyContact,
      contactNumber,
      currentHealthStatus
    });

    res.status(201).json({ message: 'Patient added successfully', patient });

  } catch (error) {
    next(error);
  }
};

// Get all patients
const getAllPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (search) {
      // Mongo can't regex across a ref, so resolve matching users first.
      const rx = { $regex: escapeRegex(search), $options: 'i' };
      const users = await User.find({ $or: [{ name: rx }, { email: rx }] }).select('_id').lean();
      filter = {
        $or: [
          { userId: { $in: users.map((u) => u._id) } },
          { contactNumber: rx },
        ],
      };
    }

    // Patients may only ever see their own record.
    if (req.user.role === 'patient') filter = { $and: [filter, { userId: req.user.id }] };

    // Doctors may only see patients linked to their own appointments.
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const patientIds = await Appointment.distinct('patientId', { doctorId: doctor._id });
      filter = { $and: [filter, { _id: { $in: patientIds } }] };
    }

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .populate('userId', 'name email phone role')
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json(getPaginationResponse(patients, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// Get one patient
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone role');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (req.user.role === 'patient' && String(patient.userId?._id) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

// Update patient
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check authorization: allow if admin/staff or if patient is updating their own profile
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this patient profile' });
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => PATIENT_EDITABLE_FIELDS.includes(key))
    );
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');
    
    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    next(error);
  }
};

// Delete patient
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile, addPatient, getAllPatients, getPatientById, updatePatient, deletePatient };