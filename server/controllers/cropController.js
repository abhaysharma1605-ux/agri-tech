const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const asyncHandler = require('../utils/asyncHandler');
const { analyzeSoil } = require('../utils/soilAnalysis');

const getOwnedCrop = async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }
  if (req.user.role !== 'admin' && String(crop.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You do not own this crop');
  }
  return crop;
};

exports.createCrop = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.body.farm);
  if (!farm || (req.user.role !== 'admin' && String(farm.owner) !== String(req.user._id))) {
    res.status(403);
    throw new Error('Invalid farm');
  }
  const crop = await Crop.create({ ...req.body, owner: farm.owner });
  res.status(201).json(crop);
});

exports.listCrops = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
  if (req.query.farm) filter.farm = req.query.farm;
  if (req.query.status) filter.status = req.query.status;
  res.json(await Crop.find(filter).populate('farm', 'name').sort('-createdAt'));
});

exports.getCrop = asyncHandler(async (req, res) => {
  const crop = await getOwnedCrop(req, res);
  const latest = crop.soilReadings.length ? crop.soilReadings[crop.soilReadings.length - 1] : null;
  res.json({ crop, soilAnalysis: analyzeSoil(latest) });
});

exports.updateCrop = asyncHandler(async (req, res) => {
  const crop = await getOwnedCrop(req, res);
  const allowed = ['name', 'variety', 'season', 'sowingDate', 'expectedHarvestDate', 'areaInAcres', 'status', 'expectedYieldKg', 'actualYieldKg'];
  allowed.forEach((k) => req.body[k] !== undefined && (crop[k] = req.body[k]));
  await crop.save();
  res.json(crop);
});

exports.deleteCrop = asyncHandler(async (req, res) => {
  const crop = await getOwnedCrop(req, res);
  await crop.deleteOne();
  res.json({ message: 'Crop deleted' });
});

exports.addSoilReading = asyncHandler(async (req, res) => {
  const crop = await getOwnedCrop(req, res);
  crop.soilReadings.push(req.body);
  await crop.save();
  const reading = crop.soilReadings[crop.soilReadings.length - 1];
  res.status(201).json({ reading, analysis: analyzeSoil(reading) });
});

exports.addActivity = asyncHandler(async (req, res) => {
  const crop = await getOwnedCrop(req, res);
  crop.activities.push(req.body);
  await crop.save();
  res.status(201).json(crop.activities[crop.activities.length - 1]);
});

exports.deleteActivity = asyncHandler(async (req, res) => {
  const crop = await getOwnedCrop(req, res);
  crop.activities.pull(req.params.activityId);
  await crop.save();
  res.json({ message: 'Activity removed' });
});

// Aggregated analytics for dashboard charts
exports.analytics = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
  const crops = await Crop.find(filter);

  const byStatus = {};
  const bySeason = {};
  const yields = [];
  crops.forEach((c) => {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    bySeason[c.season] = (bySeason[c.season] || 0) + 1;
    if (c.expectedYieldKg || c.actualYieldKg) {
      yields.push({ name: c.name, expected: c.expectedYieldKg || 0, actual: c.actualYieldKg || 0 });
    }
  });

  res.json({
    totalCrops: crops.length,
    byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    bySeason: Object.entries(bySeason).map(([name, value]) => ({ name, value })),
    yields,
  });
});
