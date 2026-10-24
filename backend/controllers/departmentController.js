const escapeRegex = require('../utils/escapeRegex');
const Department = require('../models/Department');

const populateDepartment = (query) => query
  .populate({ path: 'headDoctorId', populate: { path: 'userId', select: 'name' } })

const addDepartment = async (req, res, next) => {
  try {
    let { name, description, location, totalStaff, headDoctorId } = req.body;

    // Convert empty string to null for optional ObjectId field
    if (headDoctorId === '') headDoctorId = null;

    const departmentExists = await Department.findOne({ name });
    if (departmentExists) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await Department.create({
      name, description, location, totalStaff, headDoctorId
    });

    const populated = await populateDepartment(Department.findById(department._id))
    res.status(201).json({ message: 'Department created successfully', department: populated });
  } catch (error) {
    next(error);
  }
};

const getAllDepartments = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { departmentName: { $regex: escapeRegex(search), $options: 'i' } },
          { departmentHead: { $regex: escapeRegex(search), $options: 'i' } },
        ],
      };
    }

    const total = await Department.countDocuments(filter);
    const departments = await populateDepartment(
      Department.find(filter)
        .skip(skip)
        .limit(limit)
    );

    res.status(200).json(getPaginationResponse(departments, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await populateDepartment(Department.findById(req.params.id))
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    
    // Convert empty string to null for optional ObjectId field
    if (updateData.headDoctorId === '') updateData.headDoctorId = null;

    const department = await populateDepartment(
      Department.findByIdAndUpdate(req.params.id, updateData, { new: true })
    )
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json({ message: 'Department updated successfully', department });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };