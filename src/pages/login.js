import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Login from '../components/Login';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-orange-950 flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glow-blob {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/50"></div>
      </div>
      
      <div className="relative bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 p-8 w-full max-w-md">
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

        <Login onSuccess={handleLoginSuccess} />

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-red-500 hover:text-red-400 font-semibold">
              Sign up here
            </Link>
          </p>
          <Link href="/landing" className="block mt-3 text-gray-500 hover:text-gray-400">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
