const EMR = require('../models/EMR');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

const addEMR = async (req, res) => {
  try {
    const { patientId, diagnosis, doctorId, appointmentId, visitDate, symptoms, notes, followUpDate, bloodPressure, temperature, weight, heartRate, prescription } = req.body;
    
    // Validate required fields
    if (!patientId || !diagnosis) {
      return res.status(400).json({ message: 'patientId and diagnosis are required' });
    }

    let finalDoctorId = doctorId;
    
    // If doctorId not provided, try to get it from authenticated user
    if (!finalDoctorId) {
      const Doctor = require('../models/Doctor');
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor) {
        finalDoctorId = doctor._id;
      } else if (req.user.role === 'doctor') {
        // If user is a doctor but no profile exists, return error
        return res.status(400).json({ message: 'Doctor profile not found. Please contact admin.' });
      } else {
        // Non-doctor users must provide doctorId
        return res.status(400).json({ message: 'doctorId is required' });
      }
    }

    // Create EMR with proper data types
    const emr = await EMR.create({
      patientId,
      doctorId: finalDoctorId,
      appointmentId: appointmentId || null,
      visitDate: visitDate ? new Date(visitDate) : new Date(),
      diagnosis,
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      notes: notes || '',
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      bloodPressure: bloodPressure || '',
      temperature: temperature || '',
      weight: weight || '',
      heartRate: heartRate || '',
      prescription: Array.isArray(prescription) ? prescription.filter(p => p.medicine) : []
    });

    const populatedEMR = await EMR.findById(emr._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' }
      });
    res.status(201).json({ message: 'EMR created successfully', emr: populatedEMR });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating EMR:', error);
    }
    res.status(500).json({ message: 'Failed to create EMR. Please try again.' });
  }
};

const getAllEMRs = async (req, res) => {
  try {
    const { search, fromDate, toDate } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      filter.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      filter.doctorId = doctor._id;
    } else if (!['admin', 'nurse', 'pharmacist', 'lab_staff'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view EMRs' });
    }

    // Date range filtering
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setDate(end.getDate() + 1);
        filter.createdAt.$lt = end;
      }
    }

    // Search filtering
    if (search) {
      filter = {
        ...filter,
        $or: [
          { 'patientId.userId.name': { $regex: search, $options: 'i' } },
          { diagnosis: { $regex: search, $options: 'i' } },
          { treatment: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await EMR.countDocuments(filter);
    const emrs = await EMR.find(filter)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(getPaginationResponse(emrs, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEMRById = async (req, res) => {
  try {
    // populate patient.userId early to compare against the authenticated user
    const emr = await EMR.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });

    if (!emr) return res.status(404).json({ message: 'EMR not found' });

    // Admins can view any EMR
    if (req.user.role === 'admin') return res.status(200).json(emr);

    // Patients can view only their own EMRs (compare patient.userId)
    if (req.user.role === 'patient') {
      const patientUserId = emr.patientId?.userId?._id?.toString() || emr.patientId?.userId?.toString();
      if (!patientUserId || patientUserId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this EMR' });
      }
      return res.status(200).json(emr);
    }

    // Doctors can view EMRs where they are the assigned doctor
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor || doctor._id.toString() !== emr.doctorId?._id?.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this EMR' });
      }
      return res.status(200).json(emr);
    }

    // Allow other staff roles (nurse, pharmacist, lab_staff) to view EMRs — adjust if you need department scoping
    if (['nurse', 'pharmacist', 'lab_staff'].includes(req.user.role)) {
      return res.status(200).json(emr);
    }

    return res.status(403).json({ message: 'Not authorized to view this EMR' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEMRByPatient = async (req, res) => {
  try {
    // Only allow patient to fetch their own EMRs, doctors for their patients, and certain staff/admin
    const targetPatient = await Patient.findById(req.params.patientId);
    if (!targetPatient) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (!patient || patient._id.toString() !== targetPatient._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this patient EMRs' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      // Only EMRs for this patient that the doctor authored
      const emrs = await EMR.find({ patientId: req.params.patientId, doctorId: doctor._id });
      const populated = await EMR.populate(emrs, [
        { path: 'patientId', populate: { path: 'userId', select: 'name email' } },
        { path: 'doctorId', populate: { path: 'userId', select: 'name email' } }
      ]);
      return res.status(200).json(populated);
    } else if (req.user.role === 'admin' || req.user.role === 'nurse' || req.user.role === 'pharmacist' || req.user.role === 'lab_staff') {
      // allowed to view all EMRs for the patient
    } else {
      return res.status(403).json({ message: 'Not authorized to view this patient EMRs' });
    }

    const emrs = await EMR.find({ patientId: req.params.patientId });
    const populated = await EMR.populate(emrs, [
      { path: 'patientId', populate: { path: 'userId', select: 'name email' } },
      { path: 'doctorId', populate: { path: 'userId', select: 'name email' } }
    ]);
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEMR = async (req, res) => {
  try {
    const emr = await EMR.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' }
      });
    if (!emr) {
      return res.status(404).json({ message: 'EMR not found' });
    }
    res.status(200).json({ message: 'EMR updated successfully', emr });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEMR = async (req, res) => {
  try {
    const emr = await EMR.findByIdAndDelete(req.params.id);
    if (!emr) {
      return res.status(404).json({ message: 'EMR not found' });
    }
    res.status(200).json({ message: 'EMR deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEMR, getAllEMRs, getEMRById, getEMRByPatient, updateEMR, deleteEMR };