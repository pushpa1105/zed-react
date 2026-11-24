import { Users } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { defineFeature } from '@/core/feature/define-feature';

import en from './i18n/en.json';
import es from './i18n/es.json';

const ADMIN_ONLY = ['ADMIN'] as const;

/** Example of a role-restricted module: route, nav and command are admin-only. */
export default defineFeature({
  id: 'users',
  routes: [
    {
      path: routes.users.path,
      access: 'protected',
      roles: ADMIN_ONLY,
      page: () => import('./pages/users-page'),
    },
  ],
  nav: [
    {
      to: routes.users.href(),
      icon: Users,
      label: (t) => t('users:nav'),
      order: 90,
      roles: ADMIN_ONLY,
    },
  ],
  i18n: { en, es },
});
