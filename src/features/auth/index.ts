import { routes } from '@/core/config/routes';
import { defineFeature } from '@/core/feature/define-feature';

import en from './i18n/en.json';
import es from './i18n/es.json';

/** Sign-in and sign-up screens. The session itself lives in `core/auth`. */
export default defineFeature({
  id: 'auth',
  routes: [
    { path: routes.login.path, access: 'guest', page: () => import('./pages/sign-in-page') },
    { path: routes.register.path, access: 'guest', page: () => import('./pages/sign-up-page') },
  ],
  i18n: { en, es },
});
