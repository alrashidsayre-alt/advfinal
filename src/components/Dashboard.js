import { useState } from 'react';
import WorkoutList from './WorkoutList';
import CreateWorkout from './CreateWorkout';
import WorkoutPlans from './WorkoutPlans';
import ProgressPhotos from './ProgressPhotos';
import Profile from './Profile';
import Community from './Community';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('workouts');
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return {};
  });

  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: '💪' },
    { id: 'create', label: 'New Workout', icon: '➕' },
    { id: 'plans', label: 'Plans', icon: '📋' },
    { id: 'community', label: 'Community', icon: '💬' },
    { id: 'progress', label: 'Progress', icon: '📸' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: 'url(/bg/hero-bg.jpg)' }}
    >
      <div className="fixed inset-0 bg-black/60 pointer-events-none"></div>
      
      <div className="relative z-10">
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-red-500 ring-2 ring-red-900/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                {user.username?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                WORKOUT TRACKER
              </h1>
              <p className="text-sm text-gray-400">Welcome back, <span className="text-red-500 font-semibold">{user.username}</span>!</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-red-500 hover:to-orange-400 transition-all font-semibold shadow-lg shadow-red-900/50"
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-black/30 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-red-500 text-red-500 bg-red-500/10'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-20">
        {activeTab === 'workouts' && <WorkoutList />}
        {activeTab === 'create' && <CreateWorkout onSuccess={() => setActiveTab('workouts')} />}
        {activeTab === 'plans' && <WorkoutPlans />}
        {activeTab === 'community' && <Community />}
        {activeTab === 'progress' && <ProgressPhotos />}
        {activeTab === 'profile' && <Profile user={user} setUser={setUser} />}
      </main>
      </div>
    </div>
  );
}