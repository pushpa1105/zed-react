/** Supported languages. Add one here and give every namespace a translation file. */
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const;

export type Language = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_NAMESPACE = 'common';
