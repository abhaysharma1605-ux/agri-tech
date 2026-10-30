const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/adminController');
const { protect, authorize, validate } = require('../middleware/auth');

// Every admin route requires a valid token AND the admin role
router.use(protect, authorize('admin'));

router.get('/stats', c.stats);
router.get('/users', c.listUsers);
router.post(
  '/users',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['farmer', 'admin', 'expert']).withMessage('Invalid role'),
  ],
  validate,
  c.createUser
);
router.put('/users/:id', c.updateUser);
router.delete('/users/:id', c.deleteUser);

module.exports = router;
