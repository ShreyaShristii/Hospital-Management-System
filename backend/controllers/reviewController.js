const Review = require('../models/Review');
const Staff = require('../models/Staff');
const Doctor = require('../models/Doctor');

const populateReview = (query) => query
  .populate({ path: 'staffId', populate: { path: 'userId', select: 'name' } })
  .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
  .populate('reviewerId', 'name email')
  .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })

const addReview = async (req, res) => {
  try {
    let { staffId, doctorId, patientId, rating, comment, category, isAnonymous } = req.body;

    // Convert empty strings to null
    staffId = staffId && String(staffId).trim() ? String(staffId).trim() : null;
    doctorId = doctorId && String(doctorId).trim() ? String(doctorId).trim() : null;

    // Validate that at least one of staffId or doctorId is provided
    if (!staffId && !doctorId) {
      return res.status(400).json({ message: 'Either staffId or doctorId must be provided' });
    }

    // Validate staff exists if staffId provided
    if (staffId) {
      try {
        const staffExists = await Staff.findById(staffId);
        if (!staffExists) {
          return res.status(404).json({ message: `Staff with ID ${staffId} not found` });
        }
      } catch (err) {
        return res.status(400).json({ message: `Invalid staff ID format: ${staffId}` });
      }
    }

    // Validate doctor exists if doctorId provided
    if (doctorId) {
      try {
        const doctorExists = await Doctor.findById(doctorId);
        if (!doctorExists) {
          return res.status(404).json({ message: `Doctor with ID ${doctorId} not found` });
        }
      } catch (err) {
        return res.status(400).json({ message: `Invalid doctor ID format: ${doctorId}` });
      }
    }

    const review = await Review.create({
      staffId,
      doctorId,
      reviewerId: req.user.id,
      patientId,
      rating,
      comment,
      category,
      isAnonymous
    });

    const populated = await populateReview(Review.findById(review._id))
    res.status(201).json({ message: 'Review added successfully', review: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { search, rating } = req.query;
    const { getPaginationParams, getPaginationResponse } = require('../utils/paginationHelper');
    const { page, limit, skip } = getPaginationParams(req.query);

    let filter = {};
    if (rating) filter.rating = parseInt(rating);
    if (search) {
      filter = {
        ...filter,
        $or: [
          { 'patientId.userId.name': { $regex: search, $options: 'i' } },
          { 'staffId.userId.name': { $regex: search, $options: 'i' } },
          { reviewText: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await Review.countDocuments(filter);
    const reviews = await populateReview(
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    );

    res.status(200).json(getPaginationResponse(reviews, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await populateReview(Review.findById(req.params.id))
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByStaff = async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find({ staffId: req.params.staffId }).sort({ createdAt: -1 })
    )
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStaffAverageRating = async (req, res) => {
  try {
    const reviews = await Review.find({ staffId: req.params.staffId });
    if (reviews.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = (totalRating / reviews.length).toFixed(2)
    res.status(200).json({
      staffId: req.params.staffId,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByDoctor = async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 })
    )
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAverageRating = async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId });
    if (reviews.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = (totalRating / reviews.length).toFixed(2)
    res.status(200).json({
      doctorId: req.params.doctorId,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment, category } = req.body;
    const review = await populateReview(
      Review.findByIdAndUpdate(
        req.params.id,
        { rating, comment, category, updatedAt: Date.now() },
        { new: true }
      )
    )
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview, getAllReviews, getReviewById,
  getReviewsByStaff, getStaffAverageRating,
  getReviewsByDoctor, getDoctorAverageRating,
  updateReview, deleteReview
};