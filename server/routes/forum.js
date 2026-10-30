const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/forumController');
const { protect, authorize, validate } = require('../middleware/auth');

router.use(protect);

router.get('/', c.list);
router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required'), body('body').trim().notEmpty().withMessage('Body is required')],
  validate,
  c.create
);
router.get('/:id', c.get);
router.post('/:id/comments', [body('text').trim().notEmpty().withMessage('Comment cannot be empty')], validate, c.comment);
router.delete('/:id', c.remove);
router.patch('/:id/moderate', authorize('admin'), c.moderate);

module.exports = router;
