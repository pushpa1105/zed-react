/**
 * i18n adapter for components. Import `useTranslation` from here, never from
 * `react-i18next` directly (ESLint enforces it), so the i18n library can be
 * replaced behind this one file.
 */
export { Trans, useTranslation } from 'react-i18next';
export type { FlatNamespace, TFunction } from 'i18next';
