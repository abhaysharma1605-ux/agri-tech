const PestAlert = require('../models/PestAlert');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const asyncHandler = require('../utils/asyncHandler');

// Alerts relevant to the farmer's regions and crops
exports.myAlerts = asyncHandler(async (req, res) => {
  const [farms, crops] = await Promise.all([
    Farm.find({ owner: req.user._id }),
    Crop.find({ owner: req.user._id, status: { $in: ['planned', 'growing'] } }),
  ]);
  const districts = farms.map((f) => f.location.district).filter(Boolean);
  const cropNames = crops.map((c) => new RegExp(`^${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));

  const alerts = await PestAlert.find({ isActive: true }).sort('-createdAt').limit(100);
  const rank = { critical: 4, high: 3, medium: 2, low: 1 };

  const result = alerts
    .map((a) => {
      const regionMatch = !a.region?.district || districts.includes(a.region.district);
      const cropMatch = !a.affectedCrops.length || a.affectedCrops.some((ac) => cropNames.some((re) => re.test(ac)));
      return { alert: a, relevant: regionMatch && cropMatch };
    })
    .filter((x) => x.relevant)
    .map((x) => x.alert)
    .sort((a, b) => rank[b.severity] - rank[a.severity]);

  res.json(result);
});

exports.listAll = asyncHandler(async (req, res) => {
  res.json(await PestAlert.find().sort('-createdAt'));
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await PestAlert.create({ ...req.body, createdBy: req.user._id }));
});

exports.update = asyncHandler(async (req, res) => {
  const alert = await PestAlert.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!alert) {
    res.status(404);
    throw new Error('Alert not found');
  }
  res.json(alert);
});

exports.remove = asyncHandler(async (req, res) => {
  const alert = await PestAlert.findByIdAndDelete(req.params.id);
  if (!alert) {
    res.status(404);
    throw new Error('Alert not found');
  }
  res.json({ message: 'Alert deleted' });
});
