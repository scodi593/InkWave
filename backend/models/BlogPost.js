const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  tags: { 
    type: String,
    trim: true,
    set: function(tags) {
      // If tags is an array, join it into a space-separated string
      if (Array.isArray(tags)) {
        return tags.join(' ').toLowerCase();
      }
      // If it's a string, ensure it's lowercase
      return typeof tags === 'string' ? tags.toLowerCase() : '';
    },
    get: function(tags) {
      // Return tags as a trimmed string
      return tags ? tags.trim() : '';
    }
  },
  image: { 
    type: String,
    trim: true
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  timestamps: true 
});

// Index for efficient queries
BlogPostSchema.index({ createdAt: -1 });
BlogPostSchema.index({ title: 1 });

// Pre-save middleware to handle tags
BlogPostSchema.pre('save', function(next) {
  if (this.isModified('tags')) {
    // If tags is an array or comma-separated string, convert to space-separated
    if (Array.isArray(this.tags)) {
      this.tags = this.tags
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean)
        .join(' ');
    } else if (typeof this.tags === 'string') {
      // Convert comma-separated to space-separated
      this.tags = this.tags
        .split(/[,\s]+/)
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean)
        .join(' ');
    }
  }
  next();
});

// Pre-update middleware to handle tags in updates
BlogPostSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  if (update && update.tags) {
    if (Array.isArray(update.tags)) {
      update.tags = update.tags
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean)
        .join(' ');
    } else if (typeof update.tags === 'string') {
      update.tags = update.tags
        .split(/[,\s]+/)
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean)
        .join(' ');
    }
  }
  next();
});

// Virtual to get tags as array when needed
BlogPostSchema.virtual('tagsArray').get(function() {
  return this.tags ? this.tags.split(' ').filter(Boolean) : [];
});

module.exports = mongoose.model('BlogPost', BlogPostSchema); 