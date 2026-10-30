const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Resource = require('../models/Resource');
const Post = require('../models/Post');
const PestAlert = require('../models/PestAlert');
const Consultation = require('../models/Consultation');
const asyncHandler = require('../utils/asyncHandler');

exports.stats = asyncHandler(async (req, res) => {
  const [users, farmers, farms, crops, orders, pendingResources, posts, alerts, openConsults, revenue] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    Farm.countDocuments(),
    Crop.countDocuments(),
    Order.countDocuments(),
    Resource.countDocuments({ isApproved: false }),
    Post.countDocuments(),
    PestAlert.countDocuments({ isActive: true }),
    Consultation.countDocuments({ status: 'open' }),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
  ]);

  const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]);
  const cropsByName = await Crop.aggregate([
    { $group: { _id: { $toLower: '$name' }, value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $limit: 8 },
  ]);

  res.json({
    users, farmers, farms, crops, orders, pendingResources, posts, activeAlerts: alerts,
    openConsultations: openConsults,
    revenue: revenue[0]?.total || 0,
    ordersByStatus: ordersByStatus.map((o) => ({ name: o._id, value: o.value })),
    topCrops: cropsByName.map((c) => ({ name: c._id, value: c.value })),
  });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  res.json(await User.find(filter).sort('-createdAt'));
});

exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const { password, ...rest } = user.toObject();
  res.status(201).json(rest);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(user._id) === String(req.user._id) && (req.body.role || req.body.isActive === false)) {
    res.status(400);
    throw new Error('You cannot change your own role or deactivate yourself');
  }
  ['role', 'isActive', 'name', 'phone'].forEach((k) => req.body[k] !== undefined && (user[k] = req.body[k]));
  await user.save();
  res.json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete yourself');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const farms = await Farm.find({ owner: user._id }).select('_id');
  await Crop.deleteMany({ farm: { $in: farms.map((f) => f._id) } });
  await Farm.deleteMany({ owner: user._id });
  res.json({ message: 'User and related farm data deleted' });
});
