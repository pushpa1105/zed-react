import { useSyncExternalStore } from 'react';

import { useThemeStore, type ThemeState } from './store';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches;
}

export function resolveMode(mode: ThemeState['mode']): 'light' | 'dark' {
  if (mode === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return mode;
}

/** Picks a readable foreground (near-black or near-white) for a hex background. */
export function getContrastForeground(hex: string): string {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.45 ? 'oklch(0.145 0 0)' : 'oklch(0.985 0 0)';
}

const CUSTOM_PRIMARY_VARS = ['--primary', '--primary-foreground', '--ring'] as const;

/** Writes a theme state to the <html> element (class, data-* attributes, CSS vars). */
export function applyTheme(state: ThemeState, root: HTMLElement = document.documentElement) {
  const resolved = resolveMode(state.mode);

  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.theme = state.preset;
  root.dataset.font = state.font;
  root.dataset.scale = state.scale;
  root.style.setProperty('--radius', `${state.radius}rem`);

  if (state.customPrimary) {
    root.style.setProperty('--primary', state.customPrimary);
    root.style.setProperty('--primary-foreground', getContrastForeground(state.customPrimary));
    root.style.setProperty('--ring', state.customPrimary);
  } else {
    CUSTOM_PRIMARY_VARS.forEach((v) => root.style.removeProperty(v));
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', resolved === 'dark' ? '#0a0a0a' : '#ffffff');
}

/**
 * Applies the persisted theme and keeps the DOM in sync with the store and with
 * OS-level color-scheme changes. Call it once at startup (see `main.tsx`).
 */
export function initTheme() {
  applyTheme(useThemeStore.getState());
  useThemeStore.subscribe((state) => applyTheme(state));

  window.matchMedia(DARK_QUERY).addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.mode === 'system') applyTheme(state);
  });
}

function subscribeToSystemTheme(callback: () => void) {
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

/** The theme actually on screen ('light' | 'dark'), with 'system' resolved. */
export function useResolvedThemeMode(): 'light' | 'dark' {
  const mode = useThemeStore((s) => s.mode);
  const systemDark = useSyncExternalStore(subscribeToSystemTheme, systemPrefersDark, () => false);
  if (mode === 'system') return systemDark ? 'dark' : 'light';
  return mode;
}

/** Design tokens exported by `buildThemeCss()`. */
const EXPORTED_TOKENS = [
  'radius',
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
] as const;

/**
 * Serializes the tokens currently on screen into a CSS block. Paste it into
 * `globals.css` (`:root` or `.dark`) to make the look you built the default.
 */
export function buildThemeCss(root: HTMLElement = document.documentElement): string {
  const styles = getComputedStyle(root);
  const selector = root.classList.contains('dark') ? '.dark' : ':root';
  const lines = EXPORTED_TOKENS.map((token) => {
    const value = styles.getPropertyValue(`--${token}`).trim();
    return value ? `  --${token}: ${value};` : null;
  }).filter(Boolean);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}
