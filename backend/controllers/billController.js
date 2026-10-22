const Bill = require('../models/Bill');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const createNotification = require('../utils/notificationHelper')

const populateBill = (query) => query
  .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
  .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' }, select: 'userId specialization' })

const addBill = async (req, res) => {
  try {
    const { patientId, doctorId, items, amount, paymentMode, paymentStatus, paymentDate } = req.body;

    const bill = await Bill.create({
      patientId, doctorId, items, amount, paymentMode, paymentStatus, paymentDate
    });

    // Notify patient of bill generation
    try {
      const patient = await Patient.findById(patientId).populate('userId', '_id')
      if (patient?.userId) {
        await createNotification({
          userId: patient.userId._id,
          title: 'Bill Generated',
          message: `A bill of ₹${amount} has been generated for your medical services`,
          type: 'Bill',
          priority: 'Medium',
          relatedEntity: 'Bill',
          relatedEntityId: bill._id,
          actionUrl: '/bills'
        })
      }
    } catch (e) {
      // Notification errors should not fail the bill creation
      if (process.env.NODE_ENV !== 'production') {
        console.error('Notification error:', e.message);
      }
    }

    const populated = await populateBill(Bill.findById(bill._id))
    res.status(201).json({ message: 'Bill created successfully', bill: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { search, status } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};

    if (role === 'patient') {
      const patient = await Patient.findOne({ userId });
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      filter.patientId = patient._id;
    }

    if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      filter.doctorId = doctor._id;
    }

    if (status) filter.paymentStatus = status;

    if (search) {
      filter = {
        ...filter,
        $or: [
          { 'patientId.userId.name': { $regex: search, $options: 'i' } },
          { items: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await Bill.countDocuments(filter);
    const bills = await populateBill(
      Bill.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    );

    res.status(200).json(getPaginationResponse(bills, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    const bill = await populateBill(Bill.findById(req.params.id))
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    // Access control — patient can only see their own bill
    if (role === 'patient') {
      const patient = await Patient.findOne({ userId });
      if (!patient || bill.patientId._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Doctor can only see bills linked to them
    if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor || bill.doctorId._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBill = async (req, res) => {
  try {
    const bill = await populateBill(
      Bill.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true })
    )
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json({ message: 'Bill updated successfully', bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBill, getAllBills, getBillById, updateBill, deleteBill }