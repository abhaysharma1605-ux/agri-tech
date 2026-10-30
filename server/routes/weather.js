const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getFarmWeather } = require('../controllers/weatherController');

router.get('/farm/:farmId', protect, getFarmWeather);

module.exports = router;
