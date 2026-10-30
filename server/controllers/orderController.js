const Order = require('../models/Order');
const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');

exports.placeOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress } = req.body;
  const ids = items.map((i) => i.resource);
  const resources = await Resource.find({ _id: { $in: ids }, isApproved: true });
  const byId = new Map(resources.map((r) => [String(r._id), r]));

  const lines = [];
  let total = 0;
  for (const item of items) {
    const r = byId.get(String(item.resource));
    if (!r) {
      res.status(400);
      throw new Error('One or more items are unavailable');
    }
    if (r.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${r.name}`);
    }
    lines.push({ resource: r._id, name: r.name, price: r.price, quantity: item.quantity });
    total += r.price * item.quantity;
  }

  // Atomically decrement stock; roll back if any line fails
  const done = [];
  try {
    for (const l of lines) {
      const upd = await Resource.updateOne({ _id: l.resource, stock: { $gte: l.quantity } }, { $inc: { stock: -l.quantity } });
      if (!upd.modifiedCount) throw new Error(`Insufficient stock for ${l.name}`);
      done.push(l);
    }
  } catch (err) {
    await Promise.all(done.map((l) => Resource.updateOne({ _id: l.resource }, { $inc: { stock: l.quantity } })));
    res.status(400);
    throw err;
  }

  const order = await Order.create({
    user: req.user._id,
    items: lines,
    totalAmount: total,
    deliveryAddress,
    statusHistory: [{ status: 'placed' }],
  });
  res.status(201).json(order);
});

exports.myOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort('-createdAt'));
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (req.user.role !== 'admin' && String(order.user._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not your order');
  }
  res.json(order);
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (!['placed', 'confirmed'].includes(order.status)) {
    res.status(400);
    throw new Error('Order can no longer be cancelled');
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled' });
  await order.save();
  await Promise.all(order.items.map((i) => Resource.updateOne({ _id: i.resource }, { $inc: { stock: i.quantity } })));
  res.json(order);
});

// Admin
exports.allOrders = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await Order.find(filter).populate('user', 'name email').sort('-createdAt'));
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  order.statusHistory.push({ status: req.body.status });
  await order.save();
  res.json(order);
});
