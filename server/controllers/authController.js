const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const userPayload = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone,
  language: u.language,
  location: u.location,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, language, location } = req.body;
  if (await User.findOne({ email })) {
    res.status(409);
    throw new Error('Email already registered');
  }
  // Public sign-up can only create farmers; admins/experts are created by an admin
  const user = await User.create({ name, email, password, phone, language, location, role: 'farmer' });
  res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.isActive) {
    res.status(403);
    throw new Error('Account is deactivated');
  }
  res.json({ token: signToken(user._id), user: userPayload(user) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: userPayload(req.user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, language, location } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (language) user.language = language;
  if (location) user.location = location;
  await user.save();
  res.json({ user: userPayload(user) });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});
