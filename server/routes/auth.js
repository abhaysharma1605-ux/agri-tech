const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/authController');
const { protect, validate } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  c.register
);
router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail(), body('password').notEmpty().withMessage('Password is required')],
  validate,
  c.login
);
router.get('/me', protect, c.me);
router.put('/profile', protect, c.updateProfile);
router.put(
  '/password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')],
  validate,
  c.changePassword
);

module.exports = router;
