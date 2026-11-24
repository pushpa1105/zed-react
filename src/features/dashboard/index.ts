import { LayoutDashboard } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { defineFeature } from '@/core/feature/define-feature';

import en from './i18n/en.json';
import es from './i18n/es.json';

export default defineFeature({
  id: 'dashboard',
  routes: [
    {
      path: routes.dashboard.path,
      access: 'protected',
      page: () => import('./pages/dashboard-page'),
    },
  ],
  nav: [
    {
      to: routes.dashboard.href(),
      icon: LayoutDashboard,
      label: (t) => t('dashboard:nav'),
      order: 10,
    },
  ],
  i18n: { en, es },
});
