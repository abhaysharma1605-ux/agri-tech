const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    body: { type: String, required: [true, 'Body is required'] },
    tags: [String],
    comments: [commentSchema],
    isHidden: { type: Boolean, default: false }, // moderated by admin
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
