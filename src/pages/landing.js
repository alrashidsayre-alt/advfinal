import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingPage from '../components/LandingPage';

export default function LandingRoute() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  return <LandingPage />;
}
