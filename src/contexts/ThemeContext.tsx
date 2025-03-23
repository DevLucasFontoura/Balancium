'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASES, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

const LOCAL_STORAGE_THEME_KEY = 'balancium-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      return savedTheme || 'light';
    }
    return 'light';
  });
  const { user } = useAuth();

  useEffect(() => {
    const loadTheme = async () => {
      if (!user) {
        // If not authenticated, use local storage theme
        return;
      }

      try {
        const preferences = await databases.listDocuments(
          DATABASES.MAIN,
          COLLECTIONS.USER_PREFERENCES,
          [Query.equal('userId', user.$id)]
        );

        if (preferences.documents.length > 0) {
          const userPrefs = preferences.documents[0];
          setTheme(userPrefs.theme || 'light');
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    };

    loadTheme();
  }, [user]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Always update local state immediately for better UX
    setTheme(newTheme);

    // Only sync with backend if user is authenticated
    if (user) {
      try {
        const preferences = await databases.listDocuments(
          DATABASES.MAIN,
          COLLECTIONS.USER_PREFERENCES,
          [Query.equal('userId', user.$id)]
        );

        if (preferences.documents.length > 0) {
          // Update existing preferences
          const userPrefs = preferences.documents[0];
          await databases.updateDocument(
            DATABASES.MAIN,
            COLLECTIONS.USER_PREFERENCES,
            userPrefs.$id,
            { theme: newTheme }
          );
        } else {
          // Create new preferences
          await databases.createDocument(
            DATABASES.MAIN,
            COLLECTIONS.USER_PREFERENCES,
            'unique()',
            {
              userId: user.$id,
              theme: newTheme,
              currency: 'BRL',
              language: 'pt-BR'
            }
          );
        }
      } catch (error) {
        console.error('Erro ao alterar tema:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 