const mongoose = require('mongoose');

// Comment schema for blog post comments
const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true }, // Reference to the blog post
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  content: { type: String, required: true }, // Comment content
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema); 