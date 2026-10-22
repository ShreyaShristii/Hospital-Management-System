const Pharmacy = require('../models/Pharmacy');

const addMedicine = async (req, res) => {
  try {
    const { medicineName, category, manufacturer, stock, price, lowStockAlert, expiryDate } = req.body;

    const medicineExists = await Pharmacy.findOne({ medicineName });
    if (medicineExists) {
      return res.status(400).json({ message: 'Medicine already exists' });
    }

    const medicine = await Pharmacy.create({
      medicineName, category, manufacturer, stock, price, lowStockAlert, expiryDate
    });

    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { medicineName: { $regex: search, $options: 'i' } },
          { genericName: { $regex: search, $options: 'i' } },
          { manufacturer: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await Pharmacy.countDocuments(filter);
    const medicines = await Pharmacy.find(filter)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json(getPaginationResponse(medicines, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const medicine = await Pharmacy.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Pharmacy.find({
      $expr: { $lte: ['$stock', '$lowStockAlert'] }
    });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicine = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Pharmacy.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMedicine, getAllMedicines, getMedicineById, getLowStockMedicines, updateMedicine, deleteMedicine };