const escapeRegex = require('../utils/escapeRegex');
const Lab = require('../models/Lab');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const createNotification = require('../utils/notificationHelper')

const populateLab = (query) => query
  .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
  .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })

const orderLabTest = async (req, res, next) => {
  try {
    const { patientId, doctorId, testName } = req.body;

    const lab = await Lab.create({ patientId, doctorId, testName });
    const populated = await populateLab(Lab.findById(lab._id))

    res.status(201).json({ message: 'Lab test ordered successfully', lab: populated });
  } catch (error) {
    next(error);
  }
};

const getAllLabTests = async (req, res, next) => {
  try {
    const { role, id: userId } = req.user;
    const { search, status } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    
    if (role === 'patient') {
      const patient = await Patient.findOne({ userId });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      filter = { patientId: patient._id };
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      filter = { doctorId: doctor._id };
    }

    if (status) filter.status = status;
    if (search) {
      filter = {
        ...filter,
        $or: [
          { 'patientId.userId.name': { $regex: escapeRegex(search), $options: 'i' } },
          { testType: { $regex: escapeRegex(search), $options: 'i' } },
        ],
      };
    }

    const total = await Lab.countDocuments(filter);
    const labs = await populateLab(
      Lab.find(filter)
        .sort({ requestedDate: -1 })
        .skip(skip)
        .limit(limit)
    );

    res.status(200).json(getPaginationResponse(labs, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getLabTestById = async (req, res, next) => {
  try {
    const lab = await populateLab(Lab.findById(req.params.id))
    if (!lab) return res.status(404).json({ message: 'Lab test not found' });
    if (req.user.role === 'patient') {
      const me = await Patient.findOne({ userId: req.user.id }).select('_id').lean();
      if (!me || String(lab.patientId?._id || lab.patientId) !== String(me._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    res.status(200).json(lab);
  } catch (error) {
    next(error);
  }
};

const getLabTestsByPatient = async (req, res, next) => {
  try {
    if (req.user.role === 'patient') {
      const me = await Patient.findOne({ userId: req.user.id }).select('_id').lean();
      if (!me || String(me._id) !== req.params.patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    const labs = await populateLab(
      Lab.find({ patientId: req.params.patientId }).sort({ requestedDate: -1 })
    )
    res.status(200).json(labs);
  } catch (error) {
    next(error);
  }
};

const updateLabTest = async (req, res, next) => {
  try {
    const existing = await Lab.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Lab test not found' });

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => !['patientId', '_id', 'requestedDate'].includes(k))
    );
    const lab = await populateLab(
      Lab.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true })
    )

    // Notify patient when lab test is completed
    try {
      if (req.body.status === 'Completed' && existing.status !== 'Completed') {
        const patient = await Patient.findById(existing.patientId).populate('userId', '_id')
        if (patient?.userId) {
          await createNotification({
            userId: patient.userId._id,
            title: 'Lab Test Results Ready',
            message: `Your ${existing.testType} lab test results are ready for review`,
            type: 'Lab',
            priority: 'High',
            relatedEntity: 'Lab',
            relatedEntityId: existing._id,
            actionUrl: '/lab'
          })
        }
      }
    } catch (e) {
      // Notification errors should not fail the lab test update
      if (process.env.NODE_ENV !== 'production') {
        console.error('Notification error:', e.message);
      }
    }

    res.status(200).json({ message: 'Lab test updated successfully', lab });
  } catch (error) {
    next(error);
  }
};

const deleteLabTest = async (req, res, next) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab test not found' });
    res.status(200).json({ message: 'Lab test deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { orderLabTest, getAllLabTests, getLabTestById, getLabTestsByPatient, updateLabTest, deleteLabTest };