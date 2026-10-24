const express = require('express');
const router = express.Router();
const { registerUser, createStaffAccount, loginUser, updateUserProfile, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validate');
const { registerRules, staffAccountRules, loginRules, profileRules } = require('../validators/authValidators');

router.post('/register', registerRules, validate, registerUser);
router.post('/staff-accounts', protect, authorize('admin'), staffAccountRules, validate, createStaffAccount);
router.post('/login', loginRules, validate, loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, profileRules, validate, updateUserProfile);

module.exports = router;
