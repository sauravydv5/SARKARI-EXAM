import { useThemeContext } from '../context/ThemeContext';

/**
 * Accessible dark/light mode toggle — persists to localStorage.
 * Production-ready: aria labels, pressed state, keyboard focus.
 */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className={`theme-toggle-thumb ${isDark ? 'dark' : 'light'}`}>
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
      <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
