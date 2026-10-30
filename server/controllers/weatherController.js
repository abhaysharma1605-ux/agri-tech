const asyncHandler = require('../utils/asyncHandler');
const { getOwnedFarm } = require('./farmController');
const { getWeatherForFarm, buildAdvisories } = require('../utils/weatherService');

exports.getFarmWeather = asyncHandler(async (req, res) => {
  req.params.id = req.params.farmId;
  const farm = await getOwnedFarm(req, res);
  try {
    const weather = await getWeatherForFarm(farm);
    res.json({ farm: { _id: farm._id, name: farm.name }, weather, advisories: buildAdvisories(weather) });
  } catch (err) {
    if (err.isAxiosError) {
      res.status(502);
      throw new Error('Weather provider is unavailable, please try again later');
    }
    throw err;
  }
});
