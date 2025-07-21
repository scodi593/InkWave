import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import CreatePost from './pages/CreatePost';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import PostDetails from './pages/PostDetails';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import DarkModeToggle from './components/DarkModeToggle';
import { setUser, setLoading } from './redux/authSlice';
import axios from 'axios';

function ProtectedRoute({ children, allowIncompleteProfile = false }) {
  const { user, loading } = useSelector(state => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;
  if (!allowIncompleteProfile && !user.hasCompletedProfile) return <Navigate to="/setup" />;
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const showSidebar = user && user.hasCompletedProfile;

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, { 
          withCredentials: true 
        });
        dispatch(setUser(res.data.user));
      } catch (err) {
        console.error('Auth check error:', err);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
        <div className="container mx-auto py-6">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/setup" 
              element={
                <ProtectedRoute allowIncompleteProfile>
                  <ProfileSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookmarks" 
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post/:id" 
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to={user ? '/' : '/auth'} />} />
          </Routes>
        </div>
      </main>
      <DarkModeToggle />
    </div>
  );
}

export default App;
