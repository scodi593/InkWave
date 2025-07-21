import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
  const user = useSelector(state => state.auth.user);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio.trim()) {
      setError('Please provide a bio to complete your profile');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        { name, bio },
        { withCredentials: true }
      );
      dispatch(setUser(res.data));
      if (res.data.hasCompletedProfile) {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-blue-700 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-100"
              placeholder="Tell us about yourself..."
              required
            />
          </div>
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup; 