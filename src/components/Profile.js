import { useState } from 'react';

export default function Profile({ user, setUser }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profile');

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, profile_picture: data.url };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Profile picture updated successfully!');
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch (error) {
      setMessage('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-8">Profile Settings</h2>

        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6 group">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-red-500 ring-4 ring-red-900/50 shadow-xl group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-6xl font-bold border-4 border-red-500 ring-4 ring-red-900/50 shadow-xl group-hover:scale-105 transition-transform">
                {user.username?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-600 to-orange-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl">📷</span>
            </div>
          </div>

          <label className="cursor-pointer bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-red-500 hover:to-orange-400 transition-all font-bold shadow-lg transform hover:scale-105">
            {uploading ? '⏳ Uploading...' : '📸 Change Profile Picture'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleProfilePicture}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('success') 
                ? 'bg-green-900/30 border border-green-500 text-green-400' 
                : 'bg-red-900/30 border border-red-500 text-red-400'
            }`}>
              {message.includes('success') ? '✅' : '⚠️'} {message}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Username
            </label>
            <p className="text-2xl text-white font-bold">{user.username}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <p className="text-2xl text-white font-bold">{user.email}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Member Since
            </label>
            <p className="text-xl text-white font-semibold">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 shadow-2xl border-2 border-red-400">
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-3xl">💪</span> Keep Pushing!
        </h3>
        <p className="text-white text-lg leading-relaxed">
          You're doing amazing! Remember, every workout counts, every rep matters, and every day is a chance to become stronger. Stay consistent, track your progress, and watch yourself transform!
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <p className="text-3xl font-bold text-white">🔥</p>
            <p className="text-white text-sm mt-1">Stay Focused</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <p className="text-3xl font-bold text-white">💯</p>
            <p className="text-white text-sm mt-1">Give 100%</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <p className="text-3xl font-bold text-white">🏆</p>
            <p className="text-white text-sm mt-1">Be Legendary</p>
          </div>
        </div>
      </div>
    </div>
  );
}