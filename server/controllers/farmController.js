const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const asyncHandler = require('../utils/asyncHandler');

// Find a farm the current user is allowed to touch (owner or admin)
const getOwnedFarm = async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  if (!farm) {
    res.status(404);
    throw new Error('Farm not found');
  }
  if (req.user.role !== 'admin' && String(farm.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You do not own this farm');
  }
  return farm;
};

exports.getOwnedFarm = getOwnedFarm;

exports.createFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.create({ ...req.body, owner: req.user._id });
  res.status(201).json(farm);
});

exports.listFarms = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
  res.json(await Farm.find(filter).sort('-createdAt'));
});

exports.getFarm = asyncHandler(async (req, res) => {
  const farm = await getOwnedFarm(req, res);
  const crops = await Crop.find({ farm: farm._id }).select('name status season sowingDate expectedHarvestDate');
  res.json({ farm, crops });
});

exports.updateFarm = asyncHandler(async (req, res) => {
  const farm = await getOwnedFarm(req, res);
  const allowed = ['name', 'location', 'areaInAcres', 'soilType', 'irrigationType', 'notes'];
  allowed.forEach((k) => req.body[k] !== undefined && (farm[k] = req.body[k]));
  await farm.save();
  res.json(farm);
});

exports.deleteFarm = asyncHandler(async (req, res) => {
  const farm = await getOwnedFarm(req, res);
  await Crop.deleteMany({ farm: farm._id });
  await farm.deleteOne();
  res.json({ message: 'Farm and its crops deleted' });
});
