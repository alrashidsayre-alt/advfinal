import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/landing');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/landing');
  };

  return <Dashboard onLogout={handleLogout} />;
}