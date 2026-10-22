const Patient = require('../models/Patient');
const User = require('../models/User');

// Get current user's patient profile
const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id }).populate('userId', 'name email phone role');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new patient
const addPatient = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (search) {
      // Search by patient name, email, or phone
      filter = {
        $or: [
          { 'userId.name': { $regex: search, $options: 'i' } },
          { 'userId.email': { $regex: search, $options: 'i' } },
          { contactNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .populate('userId', 'name email phone role')
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json(getPaginationResponse(patients, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one patient
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone role');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check authorization: allow if admin/staff or if patient is updating their own profile
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this patient profile' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'name email phone');
    
    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, addPatient, getAllPatients, getPatientById, updatePatient, deletePatient };