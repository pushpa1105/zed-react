import { initI18n } from '@/core/i18n/i18n';

import { modules } from './modules';
import { getTranslations } from './registry';

/** Registers `common` plus every feature's namespace. Imported once by main.tsx and tests. */
export const i18n = initI18n(getTranslations(modules));
