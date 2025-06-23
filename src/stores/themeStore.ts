import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system' as Theme,
      setTheme: (theme: Theme) => set({ theme }),
      initializeTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';
          set({ theme: systemTheme as Theme });
        }
      },
    }),
    {
      name: 'theme-storage',
      // Optionally, you can add a partialize or merge option here if needed for more complex state
    }
  )
);
