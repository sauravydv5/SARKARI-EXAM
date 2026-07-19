import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { applyTheme, getPreferredTheme, THEME_KEY } from '../hooks/useTheme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    }
    return 'light';
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch {
        return;
      }
      setThemeState(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((t) => {
    if (t === 'dark' || t === 'light') setThemeState(t);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
}
