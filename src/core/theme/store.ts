import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ThemeFont,
  type ThemeMode,
  type ThemePreset,
  type ThemeScale,
} from './config';

export type ThemeState = {
  mode: ThemeMode;
  preset: ThemePreset;
  font: ThemeFont;
  scale: ThemeScale;
  /** Border radius in rem. */
  radius: number;
  /** Optional hex color that overrides the preset's primary color. */
  customPrimary: string | null;
};

type ThemeActions = {
  setMode: (mode: ThemeMode) => void;
  setPreset: (preset: ThemePreset) => void;
  setFont: (font: ThemeFont) => void;
  setScale: (scale: ThemeScale) => void;
  setRadius: (radius: number) => void;
  setCustomPrimary: (color: string | null) => void;
  reset: () => void;
};

/**
 * Global theme store. It is persisted to localStorage under
 * `THEME_STORAGE_KEY`, which the inline script in `index.html` also reads
 * to apply the theme before first paint (no flash of the wrong theme).
 */
export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      ...DEFAULT_THEME,
      setMode: (mode) => set({ mode }),
      setPreset: (preset) => set({ preset, customPrimary: null }),
      setFont: (font) => set({ font }),
      setScale: (scale) => set({ scale }),
      setRadius: (radius) => set({ radius }),
      setCustomPrimary: (customPrimary) => set({ customPrimary }),
      reset: () => set(DEFAULT_THEME),
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ mode, preset, font, scale, radius, customPrimary }) => ({
        mode,
        preset,
        font,
        scale,
        radius,
        customPrimary,
      }),
    },
  ),
);
