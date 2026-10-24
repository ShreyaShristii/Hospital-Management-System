const escapeRegex = require('../utils/escapeRegex');
const Bed = require('../models/Bed');

const addBed = async (req, res, next) => {
  try {
    const { bedNumber, ward, room } = req.body;

    const bedExists = await Bed.findOne({ bedNumber });
    if (bedExists) {
      return res.status(400).json({ message: 'Bed already exists' });
    }

    const bed = await Bed.create({ bedNumber, ward, room });
    res.status(201).json({ message: 'Bed added successfully', bed });

  } catch (error) {
    next(error);
  }
};

const getAllBeds = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter = {
        ...filter,
        bedNumber: { $regex: escapeRegex(search), $options: 'i' },
      };
    }

    const total = await Bed.countDocuments(filter);
    const beds = await Bed.find(filter)
      .populate('patientId')
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json(getPaginationResponse(beds, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getAvailableBeds = async (req, res, next) => {
  try {
    const beds = await Bed.find({ status: 'Available' });
    res.status(200).json(beds);
  } catch (error) {
    next(error);
  }
};

const updateBed = async (req, res, next) => {
  try {
    const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.status(200).json({ message: 'Bed updated successfully', bed });
  } catch (error) {
    next(error);
  }
};

const deleteBed = async (req, res, next) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.status(200).json({ message: 'Bed deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addBed, getAllBeds, getAvailableBeds, updateBed, deleteBed };