const express = require('express');
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');
const router = express.Router();

// Create a new blog post
router.post('/', auth, postController.createPost);

// Get all blog posts (feed)
router.get('/', auth.optional, postController.getAllPosts);

// Search blog posts by title or tags
router.get('/search', postController.searchPosts);

// Get a single blog post by ID (with comments)
router.get('/:id', postController.getPostById);

// Update a blog post (only by owner)
router.put('/:id', auth, postController.updatePost);

// Delete a blog post (only by owner)
router.delete('/:id', auth, postController.deletePost);

// Add a comment to a post
router.post('/:id/comments', auth, postController.addComment);

// Get comments for a post
router.get('/:id/comments', postController.getComments);

// Like a post
router.post('/:id/like', auth, postController.likePost);
// Unlike a post
router.delete('/:id/like', auth, postController.unlikePost);

module.exports = router; 