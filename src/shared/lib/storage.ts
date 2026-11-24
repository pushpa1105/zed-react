/**
 * Thin, typed and SSR/privacy-mode-safe wrapper around localStorage.
 * Keys are namespaced to avoid clashes with other apps on the same origin.
 */
const PREFIX = 'app:';

export const storage = {
  get<T>(key: string, fallback: T | null = null): T | null {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage may be full or unavailable */
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};
