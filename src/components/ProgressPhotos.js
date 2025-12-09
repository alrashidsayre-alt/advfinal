import { useState, useEffect } from 'react';

export default function ProgressPhotos() {
  const [photos, setPhotos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    caption: '',
    weight: '',
    photo_date: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setPhotos(data.photos);
    } catch (error) {
      console.error('Failed to load photos');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');

    const fileInput = document.getElementById('photo-file');
    const file = fileInput.files[0];

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'progress');
      uploadData.append('caption', formData.caption);
      uploadData.append('weight', formData.weight);
      uploadData.append('photo_date', formData.photo_date);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Photo uploaded successfully!');
        setShowUpload(false);
        setFormData({ caption: '', weight: '', photo_date: new Date().toISOString().split('T')[0] });
        fileInput.value = '';
        fetchPhotos();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Progress Photos</h2>
          <p className="text-gray-400 mt-1">Track your transformation journey</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className={`px-6 py-3 rounded-lg transition-all font-semibold shadow-lg ${
            showUpload 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400'
          }`}
        >
          {showUpload ? '✕ Cancel' : '📸 Upload Photo'}
        </button>
      </div>

      {showUpload && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">Upload Progress Photo</h3>
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📷 Photo (Max 5MB - JPEG, PNG, WebP)
              </label>
              <input
                id="photo-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-red-600 file:to-orange-500 file:text-white file:font-semibold hover:file:from-red-500 hover:file:to-orange-400 file:cursor-pointer"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📅 Date
                </label>
                <input
                  type="date"
                  value={formData.photo_date}
                  onChange={(e) => setFormData({ ...formData, photo_date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ⚖️ Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500"
                  placeholder="75.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💬 Caption
              </label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500"
                rows="2"
                placeholder="Describe your progress..."
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-900/30 border border-green-500 text-green-400' 
                  : 'bg-red-900/30 border border-red-500 text-red-400'
              }`}>
                {message.includes('success') ? '✅' : '⚠️'} {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-red-500 hover:to-orange-400 disabled:opacity-50 transition-all shadow-lg transform hover:scale-[1.02]"
            >
              {uploading ? '📤 Uploading...' : '📤 Upload Photo'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all border border-gray-700 group">
            <div className="relative overflow-hidden">
              <img
                src={photo.photo_url}
                alt={photo.caption || 'Progress photo'}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <span className="text-red-500">📅</span>
                {new Date(photo.photo_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {photo.weight && (
                <p className="text-white font-bold text-lg mb-2">⚖️ {photo.weight} kg</p>
              )}
              {photo.caption && (
                <p className="text-gray-300 italic">"{photo.caption}"</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && !showUpload && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700">
          <p className="text-7xl mb-4">📸</p>
          <p className="text-gray-300 text-2xl font-bold mb-2">No progress photos yet</p>
          <p className="text-gray-500 mt-2">Start documenting your fitness journey!</p>
        </div>
      )}
    </div>
  );
}