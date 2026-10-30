const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/cropController');
const { protect, validate } = require('../middleware/auth');

router.use(protect);

router.get('/analytics/summary', c.analytics);

router
  .route('/')
  .get(c.listCrops)
  .post(
    [
      body('farm').isMongoId().withMessage('Valid farm is required'),
      body('name').trim().notEmpty().withMessage('Crop name is required'),
      body('sowingDate').isISO8601().withMessage('Valid sowing date is required'),
    ],
    validate,
    c.createCrop
  );

router.route('/:id').get(c.getCrop).put(c.updateCrop).delete(c.deleteCrop);

router.post(
  '/:id/soil',
  [
    body('ph').optional().isFloat({ min: 0, max: 14 }).withMessage('pH must be between 0 and 14'),
    body('moisture').optional().isFloat({ min: 0, max: 100 }).withMessage('Moisture must be 0-100'),
    body('nitrogen').optional().isFloat({ min: 0 }),
    body('phosphorus').optional().isFloat({ min: 0 }),
    body('potassium').optional().isFloat({ min: 0 }),
  ],
  validate,
  c.addSoilReading
);
router.post('/:id/activities', [body('type').optional().isIn(['sowing', 'irrigation', 'fertilizer', 'pesticide', 'weeding', 'harvest', 'other'])], validate, c.addActivity);
router.delete('/:id/activities/:activityId', c.deleteActivity);

module.exports = router;
