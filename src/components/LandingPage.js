import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <div 
      className="min-h-screen text-white overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/bg/landingpage-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <nav className="fixed top-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💪</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              Workout Tracker
            </span>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="px-6 py-2 text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-700 hover:to-orange-600 transition font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                  Transform Your Fitness
                </span>
                <br />
                <span className="text-white">Journey Today</span>
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Track your workouts, monitor progress, and achieve your fitness goals with our comprehensive training platform. Join thousands of athletes building their best selves.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-700 hover:to-orange-600 transition font-semibold text-center">
                  Get Started Free
                </Link>
                <Link href="/login" className="px-8 py-4 border-2 border-gray-600 rounded-lg hover:border-gray-400 transition font-semibold text-center">
                  Sign In
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-8 border-t border-gray-800">
                <div>
                  <div className="text-2xl font-bold text-red-500">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">50K+</div>
                  <div className="text-sm text-gray-400">Workouts Tracked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">100%</div>
                  <div className="text-sm text-gray-400">Free to Use</div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700">
                <div className="space-y-4">
                  <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monday Workout</span>
                      <span className="text-green-400 font-semibold">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full w-3/4 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Weight Progress</span>
                      <span className="text-red-400 font-semibold">↑ +2kg</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div className="bg-red-500 h-full w-1/2 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Weekly Goal</span>
                      <span className="text-blue-400 font-semibold">4/5 workouts</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full w-4/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-gray-800 relative z-10 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to Succeed
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-red-600 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-gray-400">
                Monitor your workouts, sets, reps, and weight. Visualize your progress over time with detailed analytics.
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-orange-600 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Create Plans</h3>
              <p className="text-gray-400">
                Design custom workout plans tailored to your goals. Organize exercises by body parts and intensity levels.
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-red-600 transition">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-400">
                Share your progress, connect with other fitness enthusiasts, and stay motivated together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-900 to-orange-900 bg-opacity-30 backdrop-blur-lg rounded-3xl p-12 border border-red-600 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Transformation?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of fitness enthusiasts and take control of your workout journey.
          </p>
          <Link href="/register" className="inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-700 hover:to-orange-600 transition font-semibold text-lg">
            Start Free Today
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-400 relative z-10 bg-black/50">
        <p>&copy; 2025 Workout Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
