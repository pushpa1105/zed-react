import { Palette, Settings, UserPen } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { defineFeature } from '@/core/feature/define-feature';

import en from './i18n/en.json';
import es from './i18n/es.json';

export default defineFeature({
  id: 'settings',
  routes: [
    {
      path: routes.settings.path,
      access: 'protected',
      page: () => import('./pages/settings-page'),
    },
  ],
  nav: [
    { to: routes.settings.href(), icon: Settings, label: (t) => t('settings:nav'), order: 100 },
  ],
  commands: [
    {
      id: 'settings.appearance',
      to: routes.settings.href({ tab: 'appearance' }),
      icon: Palette,
      label: (t) => t('settings:commands.appearance'),
      keywords: ['theme', 'color', 'dark'],
    },
    {
      id: 'settings.profile',
      to: routes.settings.href({ tab: 'profile' }),
      icon: UserPen,
      label: (t) => t('settings:commands.profile'),
      keywords: ['account', 'name'],
    },
  ],
  i18n: { en, es },
});
