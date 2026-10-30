const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/resourceController');
const { protect, authorize, validate } = require('../middleware/auth');

router.use(protect);

router.get('/', c.list);
router.post(
  '/',
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').isIn(['seeds', 'fertilizer', 'pesticide', 'equipment', 'tools', 'other']).withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
  ],
  validate,
  c.create
);
router.put('/:id', authorize('admin'), c.update);
router.patch('/:id/approve', authorize('admin'), c.approve);
router.delete('/:id', authorize('admin'), c.remove);

module.exports = router;
