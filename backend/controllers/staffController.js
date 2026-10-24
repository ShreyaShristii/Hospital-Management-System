const Staff = require('../models/Staff');
const User = require('../models/User');

// Add new staff
const addStaff = async (req, res, next) => {
  try {
    const { userId, department, position, specialization, experience, licenseNumber, qualifications, contactNumber, address } = req.body;

    const staffExists = await Staff.findOne({ userId });
    if (staffExists) {
      return res.status(400).json({ message: 'Staff member already exists' });
    }

    const staff = await Staff.create({
      userId,
      department,
      position,
      specialization,
      experience,
      licenseNumber,
      qualifications,
      contactNumber,
      address
    });

    res.status(201).json({ message: 'Staff added successfully', staff });
  } catch (error) {
    next(error);
  }
};

// Get all staff
const getAllStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find()
      .populate('userId', 'name email')
      .populate('department', 'name');
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

// Get staff by ID
const getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('department', 'name');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

// Get staff by department
const getStaffByDepartment = async (req, res, next) => {
  try {
    const staff = await Staff.find({ department: req.params.departmentId })
      .populate('userId', 'name email')
      .populate('department', 'name');
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

// Get current logged-in user's staff profile
const getMyStaffProfile = async (req, res, next) => {
  try {
    const staff = await Staff.findOne({ userId: req.user.id })
      .populate('userId', 'name email')
      .populate('department', 'name');

    if (!staff) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }

    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

// Update staff
const updateStaff = async (req, res, next) => {
  try {
    const { position, specialization, experience, licenseNumber, licenseExpiry, qualifications, status, contactNumber, address } = req.body;
    
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Check authorization: allow if admin or if the staff member is updating their own profile
    if (req.user.role !== 'admin' && staff.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this staff profile' });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        position,
        specialization,
        experience,
        licenseNumber,
        licenseExpiry,
        qualifications,
        status,
        contactNumber,
        address,
        updatedAt: Date.now()
      },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('department', 'name');

    res.status(200).json({ message: 'Staff updated successfully', staff: updatedStaff });
  } catch (error) {
    next(error);
  }
};

// Delete staff
const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addStaff,
  getAllStaff,
  getStaffById,
  getStaffByDepartment,
  getMyStaffProfile,
  updateStaff,
  deleteStaff
};
