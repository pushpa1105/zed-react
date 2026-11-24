/**
 * Theme registry: the single place that describes which theme options exist.
 *
 * - Presets map to `:root[data-theme='<value>']` blocks in `src/styles/themes.css`.
 * - Fonts map to `:root[data-font='<value>']` blocks.
 * - Scales map to `:root[data-scale='<value>']` blocks.
 *
 * The customizer UI is generated from these arrays, so adding an entry here
 * (plus its CSS block) is all it takes to offer a new option.
 */

export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const THEME_PRESETS = [
  { value: 'neutral', label: 'Neutral', swatch: 'oklch(0.205 0 0)' },
  { value: 'blue', label: 'Blue', swatch: 'oklch(0.546 0.245 262.881)' },
  { value: 'green', label: 'Green', swatch: 'oklch(0.627 0.194 149.214)' },
  { value: 'rose', label: 'Rose', swatch: 'oklch(0.586 0.253 17.585)' },
  { value: 'orange', label: 'Orange', swatch: 'oklch(0.646 0.222 41.116)' },
  { value: 'violet', label: 'Violet', swatch: 'oklch(0.541 0.281 293.009)' },
] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number]['value'];

export const THEME_FONTS = [
  { value: 'geist', label: 'Geist' },
  { value: 'system', label: 'System' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' },
] as const;
export type ThemeFont = (typeof THEME_FONTS)[number]['value'];

export const THEME_SCALES = [
  { value: 'sm', label: 'Compact' },
  { value: 'md', label: 'Default' },
  { value: 'lg', label: 'Large' },
] as const;
export type ThemeScale = (typeof THEME_SCALES)[number]['value'];

export const THEME_RADII = [0, 0.3, 0.5, 0.625, 0.75, 1] as const;

export const THEME_STORAGE_KEY = 'zed-react:theme';

export const DEFAULT_THEME = {
  mode: 'system' as ThemeMode,
  preset: 'neutral' as ThemePreset,
  font: 'geist' as ThemeFont,
  scale: 'md' as ThemeScale,
  radius: 0.625,
  customPrimary: null as string | null,
};
