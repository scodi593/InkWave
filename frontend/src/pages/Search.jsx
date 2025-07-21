import React, { useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/search?q=${encodeURIComponent(query.trim())}`,
        { withCredentials: true }
      );
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search posts. Please try again.');
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 font-vivante drop-shadow">Search Posts</h2>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, content, or tags..."
              className="w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching posts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.length === 0 ? (
            query.trim() ? (
              <div className="text-center text-gray-500 py-8">
                No posts found matching "{query}"
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Enter a search term to find posts
              </div>
            )
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-700">
                Found {results.length} {results.length === 1 ? 'post' : 'posts'}
              </h3>
              {results.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 