export type Theme = 'light' | 'dark';

export const themes = {
  light: {
    background: '#ffffff',
    text: '#1a1a1a',
    primary: '#4a4a4a',
    secondary: '#6b6b6b',
    accent: '#3b82f6',
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#e5e5e5',
    secondary: '#a3a3a3',
    accent: '#60a5fa',
  },
} as const;
