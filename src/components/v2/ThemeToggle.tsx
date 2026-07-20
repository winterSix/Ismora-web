'use client';

import { useTheme, type ThemeMode } from '@/contexts/ThemeContext';

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const LABEL: Record<ThemeMode, string> = {
  system: 'Following system theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

export function ThemeToggle() {
  const { mode, resolvedTheme, setMode } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setMode(NEXT_MODE[mode])}
      aria-label={`${LABEL[mode]} — click to change`}
      title={LABEL[mode]}
    >
      {resolvedTheme === 'light' ? (
        // Sun
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v3M12 19v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2 12h3M19 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
        </svg>
      ) : (
        // Moon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
        </svg>
      )}
      {mode === 'system' && <span className="theme-toggle-dot" aria-hidden />}
    </button>
  );
}
