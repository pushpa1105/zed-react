import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

import '@/app/i18n';

import { resetDb } from '@/mocks/db';
import { server } from '@/mocks/server';

// Register jest-dom matchers on Vitest's expect explicitly (robust across module instances).
expect.extend(matchers);

// ---- jsdom polyfills required by Radix UI / shadcn ------------------------
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Element.prototype.scrollIntoView = () => {};
Element.prototype.hasPointerCapture = () => false;
Element.prototype.releasePointerCapture = () => {};

// ---- MSW --------------------------------------------------------------------
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterAll(() => server.close());

beforeEach(() => {
  resetDb();
  window.localStorage.clear();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});
