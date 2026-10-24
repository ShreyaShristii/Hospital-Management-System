const User = require('../models/User');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { signToken } = require('../services/tokenService');

const BCRYPT_ROUNDS = 12;

// Compared against when the user does not exist, so response time doesn't reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  username: user.username,
});

const createAccount = async (data, role) => {
  const password = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  return User.create({
    name: data.name,
    username: data.username,
    email: data.email,
    password,
    role,
    phone: data.phone,
  });
};

// Public sign-up: the role is never taken from the client.
const registerUser = asyncHandler(async (req, res) => {
  const user = await createAccount(req.body, 'patient');

  try {
    const { age, gender, bloodGroup, allergies, address, contactNumber, emergencyContact, currentHealthStatus } = req.body;
    await Patient.create({
      userId: user._id, age, gender, bloodGroup, allergies, address, contactNumber, emergencyContact, currentHealthStatus,
    });
  } catch (err) {
    await User.deleteOne({ _id: user._id });
    throw err;
  }

  res.status(201).json({ success: true, message: 'User registered successfully', userId: user._id });
});

// Admin-only provisioning of staff accounts.
const createStaffAccount = asyncHandler(async (req, res) => {
  const user = await createAccount(req.body, req.body.role);
  res.status(201).json({ success: true, message: 'Staff account created', userId: user._id });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

  if (!user || !isMatch || !user.isActive) {
    throw new AppError('Invalid email or password', 401);
  }

  res.status(200).json({ token: signToken(user), user: publicUser(user) });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) throw new AppError('User not found', 404);

  if (newPassword) {
    if (!currentPassword) throw new AppError('Current password is required to change password', 400);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 400);
    }
    user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({ message: 'Profile updated successfully', user: publicUser(user) });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json(publicUser(user));
});

module.exports = { registerUser, createStaffAccount, loginUser, updateUserProfile, getCurrentUser };
