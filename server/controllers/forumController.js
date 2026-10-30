const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { isHidden: false };
  if (req.query.tag) filter.tags = req.query.tag;
  const posts = await Post.find(filter).populate('author', 'name role').sort('-createdAt').limit(100);
  res.json(posts.map((p) => ({ ...p.toObject(), commentCount: p.comments.length, comments: undefined })));
});

exports.get = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name role').populate('comments.author', 'name role');
  if (!post || (post.isHidden && req.user.role !== 'admin')) {
    res.status(404);
    throw new Error('Post not found');
  }
  res.json(post);
});

exports.create = asyncHandler(async (req, res) => {
  const tags = (req.body.tags || []).map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  res.status(201).json(await Post.create({ ...req.body, tags, author: req.user._id }));
});

exports.comment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.isHidden) {
    res.status(404);
    throw new Error('Post not found');
  }
  post.comments.push({ author: req.user._id, text: req.body.text });
  await post.save();
  res.status(201).json(post.comments[post.comments.length - 1]);
});

exports.remove = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (req.user.role !== 'admin' && String(post.author) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only delete your own posts');
  }
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

// Admin moderation
exports.moderate = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { isHidden: !!req.body.isHidden }, { new: true });
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  res.json(post);
});
