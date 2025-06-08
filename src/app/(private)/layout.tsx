'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { Sidebar } from '@/components/SideBar/Sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const { isOpen: sidebarOpen } = useSidebar();

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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main 
          className={`
            relative
            min-h-screen 
            transition-all 
            duration-300 
            ease-in-out
            pt-20 lg:pt-8
            ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}
          `}
        >
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}