const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment'); // Added missing import for Comment

// Get current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    
    // Get posts with populated author and counts
    const posts = await BlogPost.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePicture');

    // Add likes and comments count for each post
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount,
        liked: post.likes.includes(req.user.id),
        bookmarked: user.bookmarks.includes(post._id)
      };
    }));

    res.json({ 
      user,
      posts: postsWithCounts
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update current user's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, profilePicture, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, 
        profilePicture, 
        bio,
        hasCompletedProfile: Boolean(bio?.trim()) // Set to true if bio is provided and not empty
      },
      { new: true }
    ).select('-__v');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error updating profile' });
  }
};

// Get another user's profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get posts with populated author and counts
    const posts = await BlogPost.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePicture');

    // Add likes and comments count for each post
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount,
        liked: req.user ? post.likes.includes(req.user.id) : false,
        bookmarked: req.user ? user.bookmarks.includes(post._id) : false
      };
    }));

    res.json({ 
      user,
      posts: postsWithCounts
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(404).json({ message: 'User not found' });
  }
};

// Bookmark a post
exports.bookmarkPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.bookmarks.includes(req.params.postId)) {
      user.bookmarks.push(req.params.postId);
      await user.save();
    }
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(400).json({ message: 'Error bookmarking post' });
  }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== req.params.postId
    );
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(400).json({ message: 'Error removing bookmark' });
  }
};

// Get all bookmarks for current user
exports.getMyBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'bookmarks',
        populate: [
          { 
            path: 'author',
            select: 'name profilePicture'
          }
        ]
      });

    // Get the populated bookmarks
    const bookmarks = user.bookmarks || [];

    // Add likes and comments count for each bookmark
    const bookmarksWithCounts = await Promise.all(bookmarks.map(async post => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        likeCount: post.likes.length,
        commentCount,
        liked: post.likes.includes(req.user.id),
        bookmarked: true // Since these are bookmarked posts
      };
    }));

    res.json(bookmarksWithCounts);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
}; 