import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Check local storage or system preference safely
  const [isDark, setIsDark] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved) {
          return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {
      console.warn('LocalStorage access denied, falling back to default', e);
    }
    return true; // Default to dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) { /* ignore */ }
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) { /* ignore */ }
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
};