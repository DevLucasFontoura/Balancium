'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          {children}
          <Toaster position="top-right" />
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
} 