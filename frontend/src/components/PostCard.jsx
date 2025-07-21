import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaRegHeart, FaHeart, FaRegCommentDots, FaRegBookmark, FaBookmark } from 'react-icons/fa';

// Default avatar as base64 to avoid external URL issues
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI0UyRThGMCIvPjxwYXRoIGQ9Ik0yMCAxOUMyMi43NiAxOSAyNSAxNi43NiAyNSAxNEMyNSAxMS4yNCAyMi43NiA5IDIwIDlDMTcuMjQgOSAxNSAxMS4yNCAxNSAxNEMxNSAxNi43NiAxNy4yNCAxOSAyMCAxOVoiIGZpbGw9IiM5NEEzQjgiLz48cGF0aCBkPSJNMjggMjlDMjggMjkuNTUyMyAyNy41NTIzIDMwIDI3IDMwSDEzQzEyLjQ0NzcgMzAgMTIgMjkuNTUyMyAxMiAyOUMxMiAyNS4xMzQgMTUuMTM0IDIyIDE5IDIySDIxQzI0Ljg2NiAyMiAyOCAyNS4xMzQgMjggMjlaIiBmaWxsPSIjOTRBM0I4Ii8+PC9zdmc+";

const PostCard = ({ post, onBookmarkToggle }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [liked, setLiked] = useState(post?.liked || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [bookmark, setBookmark] = useState(post?.bookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Initialize states from post data
  useEffect(() => {
    if (post) {
      setLiked(post.liked || false);
      setLikeCount(post.likeCount || 0);
      setBookmark(post.bookmarked || false);
    }
  }, [post]);

  // Ensure post and author data exists
  if (!post) {
    return null;
  }

  const author = post.author || {
    name: 'Unknown Author',
    profilePicture: DEFAULT_AVATAR
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setLikeLoading(true);
    try {
      if (liked) {
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`,
          { withCredentials: true }
        );
        setLikeCount(res.data.likes);
        setLiked(false);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`,
          {},
          { withCredentials: true }
        );
        setLikeCount(res.data.likes);
        setLiked(true);
      }
      // Refresh parent component to get latest state
      if (onBookmarkToggle) {
        await onBookmarkToggle();
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
    setLikeLoading(false);
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setBookmarkLoading(true);
    try {
      if (bookmark) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/bookmarks/${post._id}`,
          { withCredentials: true }
        );
        setBookmark(false);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/bookmarks/${post._id}`,
          {},
          { withCredentials: true }
        );
        setBookmark(true);
      }
      // Refresh parent component to get latest state
      if (onBookmarkToggle) {
        await onBookmarkToggle();
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
    setBookmarkLoading(false);
  };

  const handlePostClick = () => {
    navigate(`/post/${post._id}`);
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/post/${post._id}#comments`);
  };

  return (
    <div 
      onClick={handlePostClick}
      className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between min-h-[200px] border border-gray-100 cursor-pointer"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={author.profilePicture || DEFAULT_AVATAR} 
            alt={author.name} 
            className="w-9 h-9 rounded-full object-cover border shadow"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR;
            }}
          />
          <span className="font-semibold text-gray-800">{author.name}</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1 truncate">{post.title}</div>
        <div className="text-gray-700 line-clamp-2 mb-2">{post.content}</div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {(Array.isArray(post.tags) ? post.tags : post.tags.split(/\s+/)).map(tag => (
              <span 
                key={tag} 
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button
            className={`flex items-center gap-1 text-base font-medium transition-colors ${
              liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
            } focus:outline-none`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            {liked ? <FaHeart /> : <FaRegHeart />} {likeCount}
          </button>
          <button
            onClick={handleCommentClick}
            className="flex items-center gap-1 text-base font-medium text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
          >
            <FaRegCommentDots /> {post.commentCount || 0}
          </button>
        </div>
        <button
          className={`flex items-center gap-1 text-base font-medium transition-colors ${
            bookmark ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'
          } focus:outline-none`}
          onClick={handleBookmark}
          disabled={bookmarkLoading}
        >
          {bookmark ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
    </div>
  );
};

export default PostCard; 