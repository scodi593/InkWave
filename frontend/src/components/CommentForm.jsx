import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`,
        { content: content.trim() },
        { withCredentials: true }
      );
      setContent('');
      onCommentAdded();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm; 