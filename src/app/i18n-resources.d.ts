import 'i18next';

import type common from '@/core/i18n/locales/en.json';
import type auth from '@/features/auth/i18n/en.json';
import type dashboard from '@/features/dashboard/i18n/en.json';
import type settings from '@/features/settings/i18n/en.json';
import type tasks from '@/features/tasks/i18n/en.json';
import type users from '@/features/users/i18n/en.json';

/**
 * Type-safe translation keys: `t('tasks:status.done')` autocompletes and a
 * typo is a compile error. One line per namespace (the generator adds it).
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      dashboard: typeof dashboard;
      settings: typeof settings;
      tasks: typeof tasks;
      users: typeof users;
    };
  }
}
