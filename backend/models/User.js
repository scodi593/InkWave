const mongoose = require('mongoose');

// User schema for Google OAuth, profile, and bookmarks
const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Google OAuth ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // URL to profile image
  bio: { type: String, default: '' },
  hasCompletedProfile: { type: Boolean, default: false }, // Track if user has completed profile setup
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }], // Array of bookmarked posts
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 