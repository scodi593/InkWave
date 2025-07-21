import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI0UyRThGMCIvPjxwYXRoIGQ9Ik0yMCAxOUMyMi43NiAxOSAyNSAxNi43NiAyNSAxNEMyNSAxMS4yNCAyMi43NiA5IDIwIDlDMTcuMjQgOSAxNSAxMS4yNCAxNSAxNEMxNSAxNi43NiAxNy4yNCAxOSAyMCAxOVoiIGZpbGw9IiM5NEEzQjgiLz48cGF0aCBkPSJNMjggMjlDMjggMjkuNTUyMyAyNy41NTIzIDMwIDI3IDMwSDEzQzEyLjQ0NzcgMzAgMTIgMjkuNTUyMyAxMiAyOUMxMiAyNS4xMzQgMTUuMTM0IDIyIDE5IDIySDIxQzI0Ljg2NiAyMiAyOCAyNS4xMzQgMjggMjlaIiBmaWxsPSIjOTRBM0I4Ii8+PC9zdmc+";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/me/bookmarks`,
        { withCredentials: true }
      );
      setBookmarks(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load bookmarks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = async () => {
    // Refresh bookmarks after toggling
    await fetchBookmarks();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 font-vivante drop-shadow">
        Your Bookmarks
      </h2>
      
      <div className="space-y-6">
        {bookmarks.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow-lg">
            No bookmarks yet. Save some posts to read later!
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map(post => (
              <PostCard 
                key={post._id} 
                post={{
                  ...post,
                  author: {
                    ...post.author,
                    profilePicture: post.author?.profilePicture || DEFAULT_AVATAR
                  }
                }}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks; 