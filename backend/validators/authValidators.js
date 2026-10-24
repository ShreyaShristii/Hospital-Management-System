const { body } = require('express-validator');

const password = body('password')
  .isString().withMessage('Password is required')
  .isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters')
  .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
  .matches(/\d/).withMessage('Password must contain a number');

const identity = [
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('username').isString().trim().matches(/^[A-Za-z0-9_.-]{3,30}$/).withMessage('Username must be 3-30 letters, numbers, . _ -'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('phone').optional({ values: 'falsy' }).isString().trim().isLength({ max: 20 }),
  password,
];

const STAFF_ROLES = ['doctor', 'nurse', 'receptionist', 'lab_staff', 'pharmacist'];

const registerRules = [
  ...identity,
  body('age').optional({ values: 'falsy' }).isInt({ min: 0, max: 150 }).withMessage('Age must be 0-150').toInt(),
  body('gender').optional({ values: 'falsy' }).isIn(['Male', 'Female', 'Other']),
];

const staffAccountRules = [
  ...identity,
  body('role').isIn(STAFF_ROLES).withMessage(`Role must be one of: ${STAFF_ROLES.join(', ')}`),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const profileRules = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail({ gmail_remove_dots: false }),
  body('phone').optional({ values: 'falsy' }).isString().trim().isLength({ max: 20 }),
  body('newPassword').optional({ values: 'falsy' })
    .isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters')
    .matches(/[A-Za-z]/).matches(/\d/),
  body('currentPassword').optional().isString(),
];

module.exports = { registerRules, staffAccountRules, loginRules, profileRules, STAFF_ROLES };
