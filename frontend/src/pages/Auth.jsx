import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const Auth = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-blue-700">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-12 flex flex-col items-center w-full max-w-md border border-blue-100 dark:border-blue-900">
        <div className="font-vivante text-6xl font-bold text-blue-700 dark:text-white mb-2 drop-shadow-lg tracking-wide">InkWave</div>
        <div className="font-vivante text-xl text-gray-700 dark:text-gray-300 mb-8 text-center ">A modern place to share your thoughts</div>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;