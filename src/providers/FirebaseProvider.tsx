'use client';

import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase/config';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (app) {
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return null; // ou um loading spinner
  }

  return <>{children}</>;
} 