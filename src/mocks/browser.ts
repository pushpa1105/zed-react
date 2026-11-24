import { setupWorker } from 'msw/browser';

import { initializeDb } from './db';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

/** Loads the persisted fake database and starts intercepting requests. */
export async function startMockBackend() {
  initializeDb();
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true });
}
