import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/globals.css';
import './app/i18n';

import { App } from './app/app';
import { modules } from './app/modules';
import { validateModules } from './app/registry';
import { setUnauthorizedHandler } from './core/api/client';
import { env } from './core/config/env';
import { routes } from './core/config/routes';
import { initTheme } from './core/theme/engine';

/** Starts the MSW mock backend in the browser when enabled in `.env`. */
async function enableMocking() {
  if (!env.ENABLE_API_MOCKING) return;
  const { startMockBackend } = await import('./mocks/browser');
  await startMockBackend();
}

initTheme();

if (import.meta.env.DEV) {
  for (const problem of validateModules(modules)) console.warn(`[modules] ${problem}`);
}

// Session expired mid-use: send the user to sign in, then back to where they were.
setUnauthorizedHandler(() => {
  const { pathname, search } = window.location;
  if (pathname.startsWith(routes.app.path)) {
    window.location.assign(routes.login.href({ redirectTo: pathname + search }));
  }
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

void enableMocking().then(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
