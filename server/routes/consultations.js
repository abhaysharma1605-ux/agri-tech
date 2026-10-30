const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/consultationController');
const { protect, authorize, validate } = require('../middleware/auth');

router.use(protect);

router.get('/', c.list);
router.post(
  '/',
  authorize('farmer'),
  [body('subject').trim().notEmpty().withMessage('Subject is required'), body('question').trim().notEmpty().withMessage('Question is required')],
  validate,
  c.create
);
router.get('/:id', c.get);
router.put('/:id/answer', authorize('expert', 'admin'), [body('answer').trim().notEmpty().withMessage('Answer is required')], validate, c.answer);
router.patch('/:id/close', c.close);

module.exports = router;
