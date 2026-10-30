const Consultation = require('../models/Consultation');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await Consultation.create({ ...req.body, farmer: req.user._id }));
});

// Farmers see their own; experts/admins see all (open ones first)
exports.list = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'farmer' ? { farmer: req.user._id } : {};
  if (req.query.status) filter.status = req.query.status;
  res.json(
    await Consultation.find(filter).populate('farmer', 'name').populate('expert', 'name').sort('status -createdAt')
  );
});

exports.get = asyncHandler(async (req, res) => {
  const c = await Consultation.findById(req.params.id).populate('farmer', 'name').populate('expert', 'name');
  if (!c) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  if (req.user.role === 'farmer' && String(c.farmer._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not your consultation');
  }
  res.json(c);
});

exports.answer = asyncHandler(async (req, res) => {
  const c = await Consultation.findById(req.params.id);
  if (!c) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  c.answer = req.body.answer;
  c.expert = req.user._id;
  c.status = 'answered';
  c.answeredAt = new Date();
  await c.save();
  res.json(c);
});

exports.close = asyncHandler(async (req, res) => {
  const c = await Consultation.findById(req.params.id);
  if (!c || (req.user.role === 'farmer' && String(c.farmer) !== String(req.user._id))) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  c.status = 'closed';
  await c.save();
  res.json(c);
});
