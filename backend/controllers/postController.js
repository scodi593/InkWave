const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// Search blog posts by title or tags
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const searchQuery = q ? q.toLowerCase().trim() : '';

    const posts = await BlogPost.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { tags: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .populate('author', 'name profilePicture')
    .sort({ createdAt: -1 });

    // Convert tags to array for each post in response
    const response = posts.map(post => {
      const postObj = post.toObject();
      postObj.tagsArray = post.tagsArray;
      return postObj;
    });

    res.json(response);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ 
      message: 'Error searching posts', 
      error: err.message 
    });
  }
};

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'Title and content are required' 
      });
    }

    // Validate user exists in request
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'User not authenticated', 
        error: 'No user ID found in request' 
      });
    }

    // Process tags (schema middleware will handle the conversion)
    const processedTags = Array.isArray(tags) 
      ? tags.join(' ') 
      : typeof tags === 'string' 
        ? tags 
        : '';

    const post = await BlogPost.create({
      author: req.user.id,
      title: title.trim(),
      content: content.trim(),
      tags: processedTags,
      image: image ? image.trim() : undefined,
    });

    // Populate author details before sending response
    const populatedPost = await BlogPost.findById(post._id)
      .populate('author', 'name profilePicture');

    // Convert tags to array for response
    const response = populatedPost.toObject();
    response.tagsArray = populatedPost.tagsArray;

    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ 
      message: 'Error creating post', 
      error: err.message || 'Unknown error occurred'
    });
  }
};

// Get all blog posts (feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'name profilePicture').sort({ createdAt: -1 });
    // Optionally, include like/comment counts and liked status if user is authenticated
    const userId = req.user?.id;
    
    // Get user's bookmarks if authenticated
    let userBookmarks = [];
    if (userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      userBookmarks = user.bookmarks || [];
    }

    const postsWithExtras = await Promise.all(posts.map(async post => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount,
        liked: userId ? post.likes.some(id => id.toString() === userId) : false,
        bookmarked: userId ? userBookmarks.some(id => id.toString() === post._id.toString()) : false,
      };
    }));
    res.json(postsWithExtras);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Get a single blog post by ID (with comments)
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name profilePicture');
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'name profilePicture');
    const userId = req.user?.id;

    // Get user's bookmarks if authenticated
    let isBookmarked = false;
    if (userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      isBookmarked = user.bookmarks?.some(id => id.toString() === post._id.toString()) || false;
    }

    res.json({
      post: {
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount: comments.length,
        liked: userId ? post.likes.some(id => id.toString() === userId) : false,
        bookmarked: isBookmarked,
      },
      comments,
    });
  } catch (err) {
    res.status(404).json({ message: 'Post not found' });
  }
};

// Update a blog post (only by owner)
exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    const { title, content, tags, image } = req.body;
    post.title = title;
    post.content = content;
    post.tags = tags;
    post.image = image;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Error updating post' });
  }
};

// Delete a blog post (only by owner)
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting post' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      post: req.params.id,
      author: req.user.id,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: 'Error adding comment' });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'name profilePicture');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(400).json({ message: 'Error liking post' });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user.id
    );
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(400).json({ message: 'Error unliking post' });
  }
}; 