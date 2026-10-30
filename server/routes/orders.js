const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/orderController');
const { protect, authorize, validate } = require('../middleware/auth');

router.use(protect);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.resource').isMongoId().withMessage('Invalid resource'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
  ],
  validate,
  c.placeOrder
);
router.get('/mine', c.myOrders);
router.get('/', authorize('admin'), c.allOrders);
router.get('/:id', c.getOrder);
router.patch('/:id/cancel', c.cancelOrder);
router.patch(
  '/:id/status',
  authorize('admin'),
  [body('status').isIn(['placed', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')],
  validate,
  c.updateStatus
);

module.exports = router;
