'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as the default page
    router.replace('/dashboard');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to MyApp</h2>
        <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}
