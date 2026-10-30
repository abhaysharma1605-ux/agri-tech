const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/alertController');
const { protect, authorize, validate } = require('../middleware/auth');

router.use(protect);

router.get('/mine', c.myAlerts);

// Admin / expert management
router.get('/', authorize('admin', 'expert'), c.listAll);
router.post(
  '/',
  authorize('admin', 'expert'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('pest').trim().notEmpty().withMessage('Pest name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  validate,
  c.create
);
router.put('/:id', authorize('admin', 'expert'), c.update);
router.delete('/:id', authorize('admin'), c.remove);

module.exports = router;
