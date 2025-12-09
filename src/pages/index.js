import { useState, useEffect } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return null;
  }

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-full mb-4">
            <span className="text-5xl">💪</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent mb-2">
            WORKOUT TRACKER
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-wider">
            Train Hard, Track Harder
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
              showLogin
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-900/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
              !showLogin
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-900/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
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

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>Transform Your Body, Transform Your Life</p>
        </div>
      </div>
    </div>
  );
}