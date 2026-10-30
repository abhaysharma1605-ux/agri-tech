const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');

// Farmers see only approved resources; admins see everything
exports.list = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { isApproved: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) filter.$text = { $search: req.query.q };
  res.json(await Resource.find(filter).sort('-createdAt'));
});

exports.create = asyncHandler(async (req, res) => {
  // Resources created by admins are approved immediately
  const resource = await Resource.create({ ...req.body, createdBy: req.user._id, isApproved: true });
  res.status(201).json(resource);
});

exports.update = asyncHandler(async (req, res) => {
  const r = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!r) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(r);
});

exports.approve = asyncHandler(async (req, res) => {
  const r = await Resource.findByIdAndUpdate(req.params.id, { isApproved: !!req.body.isApproved }, { new: true });
  if (!r) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(r);
});

exports.remove = asyncHandler(async (req, res) => {
  const r = await Resource.findByIdAndDelete(req.params.id);
  if (!r) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json({ message: 'Resource deleted' });
});
