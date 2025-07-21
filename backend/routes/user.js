const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const router = express.Router();

// Get current user's profile
router.get('/me', auth, userController.getMyProfile);

// Update current user's profile
router.put('/me', auth, userController.updateMyProfile);

// Get another user's profile by ID
router.get('/:id', userController.getUserProfile);

// Bookmark a post
router.post('/bookmarks/:postId', auth, userController.bookmarkPost);

// Remove bookmark
router.delete('/bookmarks/:postId', auth, userController.removeBookmark);

// Get all bookmarks for current user
router.get('/me/bookmarks', auth, userController.getMyBookmarks);

module.exports = router; 