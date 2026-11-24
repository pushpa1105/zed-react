import i18n, { type Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { env } from '@/core/config/env';

import { DEFAULT_NAMESPACE, LANGUAGES, type Language } from './languages';
import commonEn from './locales/en.json';
import commonEs from './locales/es.json';

/**
 * i18n is split into namespaces: `common` (owned by core, shared UI strings)
 * plus one namespace per feature, contributed by its manifest. `src/app`
 * calls `initI18n()` with every feature's translations.
 */
export const commonTranslations = { en: commonEn, es: commonEs };

type Bundles = Record<string, Partial<Record<Language, object>>>;

export function initI18n(featureBundles: Bundles = {}) {
  const bundles: Bundles = { [DEFAULT_NAMESPACE]: commonTranslations, ...featureBundles };

  const resources: Resource = {};
  for (const { code } of LANGUAGES) {
    resources[code] = {};
    for (const [namespace, translations] of Object.entries(bundles)) {
      const bundle = translations[code];
      if (bundle) resources[code][namespace] = bundle as Resource[string][string];
    }
  }

  if (i18n.isInitialized) {
    for (const [lng, namespaces] of Object.entries(resources)) {
      for (const [ns, bundle] of Object.entries(namespaces)) {
        i18n.addResourceBundle(lng, ns, bundle, true, true);
      }
    }
    return i18n;
  }

  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      ns: Object.keys(bundles),
      defaultNS: DEFAULT_NAMESPACE,
      fallbackNS: DEFAULT_NAMESPACE,
      fallbackLng: env.DEFAULT_LOCALE,
      supportedLngs: LANGUAGES.map((l) => l.code),
      interpolation: { escapeValue: false }, // React already escapes
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'zed-react:locale',
        caches: ['localStorage'],
      },
    });

  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
  });

  return i18n;
}

export { i18n };
