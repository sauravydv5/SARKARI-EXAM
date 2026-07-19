import { useCallback, useEffect, useState } from 'react';

export const THEME_KEY = 'sr-theme';

export function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* private mode */
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#dc2626');
  }
}

export function useTheme() {
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

  // Sync if user changes OS theme and no explicit preference was ever set — only when storage empty
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

  return { theme, isDark: theme === 'dark', toggleTheme, setTheme };
}
