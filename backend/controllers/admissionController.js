const escapeRegex = require('../utils/escapeRegex');
const Admission = require('../models/Admission');
const Bed = require('../models/Bed');
const Patient = require('../models/Patient');
const createNotification = require('../utils/notificationHelper')

const populateAdmission = (query) => query
  .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
  .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
  .populate('bedId', 'bedNumber ward room')

const admitPatient = async (req, res, next) => {
  try {
    const { patientId, doctorId, bedId, reason } = req.body;

    const bed = await Bed.findById(bedId);
    if (!bed) return res.status(404).json({ message: 'Bed not found' });
    if (bed.status === 'Occupied') {
      return res.status(400).json({ message: 'Bed is already occupied' });
    }

    const admission = await Admission.create({ patientId, doctorId, bedId, reason });
    await Bed.findByIdAndUpdate(bedId, { status: 'Occupied', patientId })

    // Notify patient of admission
    try {
      const patient = await Patient.findById(patientId).populate('userId', '_id')
      if (patient?.userId) {
        await createNotification({
          userId: patient.userId._id,
          title: 'Hospital Admission',
          message: `You have been admitted to the hospital. Reason: ${reason}`,
          type: 'Admission',
          priority: 'High',
          relatedEntity: 'Admission',
          relatedEntityId: admission._id,
          actionUrl: '/admissions'
        })
      }
    } catch (e) {
      // Notification errors should not fail the admission creation
      if (process.env.NODE_ENV !== 'production') {
        console.error('Notification error:', e.message);
      }
    }

    const populated = await populateAdmission(Admission.findById(admission._id))
    res.status(201).json({ message: 'Patient admitted successfully', admission: populated });
  } catch (error) {
    next(error);
  }
};

const dischargePatient = async (req, res, next) => {
  try {
    const existing = await Admission.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Admission not found' });

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: 'Discharged', dischargeDate: Date.now() },
      { new: true }
    );

    await Bed.findByIdAndUpdate(admission.bedId, { status: 'Available', patientId: null })

    // Notify patient of discharge
    try {
      const patient = await Patient.findById(existing.patientId).populate('userId', '_id')
      if (patient?.userId) {
        await createNotification({
          userId: patient.userId._id,
          title: 'Hospital Discharge',
          message: 'You have been discharged from the hospital. Please follow the aftercare instructions.',
          type: 'Admission',
          priority: 'Medium',
          relatedEntity: 'Admission',
          relatedEntityId: existing._id,
          actionUrl: '/admissions'
        })
      }
    } catch (e) {
      // Notification errors should not fail the discharge
      if (process.env.NODE_ENV !== 'production') {
        console.error('Notification error:', e.message);
      }
    }

    const populated = await populateAdmission(Admission.findById(admission._id))
    res.status(200).json({ message: 'Patient discharged successfully', admission: populated });
  } catch (error) {
    next(error);
  }
};

const getAllAdmissions = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter = {
        ...filter,
        $or: [
          { 'patientId.userId.name': { $regex: escapeRegex(search), $options: 'i' } },
          { 'bedId.bedNumber': { $regex: escapeRegex(search), $options: 'i' } },
        ],
      };
    }

    const total = await Admission.countDocuments(filter);
    const admissions = await populateAdmission(
      Admission.find(filter)
        .sort({ admissionDate: -1 })
        .skip(skip)
        .limit(limit)
    );

    res.status(200).json(getPaginationResponse(admissions, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getAdmissionById = async (req, res, next) => {
  try {
    const admission = await populateAdmission(Admission.findById(req.params.id))
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    res.status(200).json(admission);
  } catch (error) {
    next(error);
  }
};

module.exports = { admitPatient, dischargePatient, getAllAdmissions, getAdmissionById };