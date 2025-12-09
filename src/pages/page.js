'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Register from '@/components/Register';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Workout Tracker
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Track your fitness journey
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              showLogin
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              !showLogin
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {showLogin ? (
          <Login onSuccess={handleLoginSuccess} />
        ) : (
          <Register onSuccess={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}