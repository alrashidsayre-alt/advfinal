import { useState } from 'react';

export default function Register({ onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage(data.error || 'Registration failed');
        }
      } else {
        setMessage('Registration successful! Please login.');
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          placeholder="johndoe"
          required
        />
        {errors.username && (
          <p className="text-red-400 text-xs mt-1">⚠️ {errors.username}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          placeholder="your@email.com"
          required
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          placeholder="••••••••"
          required
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">⚠️ {errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          placeholder="••••••••"
          required
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">⚠️ {errors.confirmPassword}</p>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('successful') 
            ? 'bg-green-900/30 border border-green-500 text-green-400' 
            : 'bg-red-900/30 border border-red-500 text-red-400'
        }`}>
          {message.includes('successful') ? '✅' : '⚠️'} {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-red-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-900/50 transform hover:scale-[1.02]"
      >
        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
      </button>
    </form>
  );
}