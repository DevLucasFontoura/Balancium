'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <SidebarProvider>
          {children}
          <Toaster position="top-right" />
        </SidebarProvider>
      </ThemeProvider>
    </FirebaseProvider>
  );
} 