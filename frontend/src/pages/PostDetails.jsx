import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPost, setLoading, setError, clearPost } from '../redux/postSlice';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaTrash, FaEdit } from 'react-icons/fa';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loading, error } = useSelector(state => state.post);
  const user = useSelector(state => state.auth.user);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(post?.liked || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [bookmark, setBookmark] = useState(user?.bookmarks?.includes(post?._id) || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedTags, setEditedTags] = useState('');
  const [editedImage, setEditedImage] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Convert tags string to array
  const tagArray = post?.tagsArray || (post?.tags ? post.tags.split(/\s+/).filter(Boolean) : []);

  useEffect(() => {
    dispatch(setLoading(true));
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`)
      .then(res => {
        dispatch(setPost(res.data.post));
        setComments(res.data.comments || []);
        // Initialize edit form with current post data
        setEditedTitle(res.data.post.title);
        setEditedContent(res.data.post.content);
        setEditedTags(res.data.post.tags || '');
        setEditedImage(res.data.post.image || '');
      })
      .catch(() => {
        dispatch(setError('Post not found'));
      });
    return () => dispatch(clearPost());
  }, [id, dispatch]);

  useEffect(() => {
    if (user && post) {
      setBookmark(user.bookmarks?.includes(post._id));
    }
  }, [user, post]);

  useEffect(() => {
    if (post) {
      setLiked(post.liked || false);
      setLikeCount(post.likeCount || 0);
    }
  }, [post]);

  const handleLike = async () => {
    if (!user || !post) return;
    setLikeLoading(true);
    try {
      if (liked) {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`, { withCredentials: true });
        setLikeCount(res.data.likes);
        setLiked(false);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`, {}, { withCredentials: true });
        setLikeCount(res.data.likes);
        setLiked(true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
    setLikeLoading(false);
  };

  const handleBookmark = async () => {
    if (!user || !post) return;
    setBookmarkLoading(true);
    try {
      if (bookmark) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/bookmarks/${post._id}`, { withCredentials: true });
        setBookmark(false);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/user/bookmarks/${post._id}`, {}, { withCredentials: true });
        setBookmark(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
    setBookmarkLoading(false);
  };

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}`, { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
    setDeleteLoading(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!post) return;
    
    setEditLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${post._id}`,
        {
          title: editedTitle,
          content: editedContent,
          tags: editedTags,
          image: editedImage
        },
        { withCredentials: true }
      );
      dispatch(setPost(response.data));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
    }
    setEditLoading(false);
  };

  const refreshComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error refreshing comments:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post.author && user._id === post.author._id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={post.author.profilePicture || 'https://via.placeholder.com/40'} 
              alt={post.author.name} 
              className="w-12 h-12 rounded-full object-cover border shadow"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-500 hover:text-blue-600 transition"
                title="Edit post"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="text-red-500 hover:text-red-600 transition"
                title="Delete post"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Title"
                required
              />
            </div>
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                placeholder="Content"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tags (space-separated)"
              />
            </div>
            <div>
              <input
                type="url"
                value={editedImage}
                onChange={(e) => setEditedImage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Image URL (optional)"
              />
            </div>
            {editedImage && (
              <div className="mt-2">
                <img
                  src={editedImage}
                  alt="Preview"
                  className="max-h-[200px] rounded-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={editLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full rounded-lg mb-6 max-h-[400px] object-cover"
              />
            )}

            <p className="text-gray-700 whitespace-pre-wrap mb-6">{post.content}</p>

            {tagArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tagArray.map(tag => (
                  <span 
                    key={tag}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <button
              className={`flex items-center gap-2 text-lg transition-colors ${liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
              onClick={handleLike}
              disabled={likeLoading}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">{comments.length}</span>
            </div>
          </div>
          <button
            className={`flex items-center gap-2 text-lg transition-colors ${bookmark ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'}`}
            onClick={handleBookmark}
            disabled={bookmarkLoading}
          >
            {bookmark ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <CommentList comments={comments} />
        <CommentForm postId={post._id} onCommentAdded={refreshComments} />
      </div>
    </div>
  );
};

export default PostDetails; 