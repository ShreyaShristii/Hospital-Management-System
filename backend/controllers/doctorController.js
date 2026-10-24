const escapeRegex = require('../utils/escapeRegex');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const addDoctor = async (req, res, next) => {
  try {
    const {
      // User fields
      name, username, email, password, phone,
      // Doctor fields
      specialization, degree, yearsOfExperience,
      successRate, workingDays, workingHours, consultationFee, departmentId
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      role: 'doctor',
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      degree,
      yearsOfExperience,
      successRate,
      workingDays,
      workingHours,
      consultationFee,
      departmentId
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate('userId', 'name email')

    res.status(201).json({ message: 'Doctor added successfully', doctor: populatedDoctor });

  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { 'userId.name': { $regex: escapeRegex(search), $options: 'i' } },
          { specialization: { $regex: escapeRegex(search), $options: 'i' } },
          { degree: { $regex: escapeRegex(search), $options: 'i' } },
        ],
      };
    }

    const total = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone')
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json(getPaginationResponse(doctors, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check authorization: allow if admin or if doctor is updating their own profile
    if (req.user.role === 'doctor' && doctor.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this doctor profile' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'name email phone');
    
    res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor };