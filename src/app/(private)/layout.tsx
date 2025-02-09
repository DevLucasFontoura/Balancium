'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { Sidebar } from '@/components/ui/Sidebar';
import { UserProfile } from '@/components/ui/UserProfile';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="flex-1">
          <Sidebar />
        </div>
        <UserProfile />
      </div>
      <main className="flex-1 overflow-auto bg-white dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
} 