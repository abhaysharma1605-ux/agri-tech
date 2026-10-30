const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/farmController');
const { protect, validate } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(c.listFarms)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Farm name is required'),
      body('areaInAcres').isFloat({ gt: 0 }).withMessage('Area must be a positive number'),
      body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
      body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
    ],
    validate,
    c.createFarm
  );

router.route('/:id').get(c.getFarm).put(c.updateFarm).delete(c.deleteFarm);

module.exports = router;
