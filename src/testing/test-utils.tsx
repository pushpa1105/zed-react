import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

import { Providers } from '@/app/providers';
import { createAppRoutes } from '@/app/routes';
import { TOKEN_KEY } from '@/core/api/client';
import { createQueryClient } from '@/core/query/query-client';
import { createMemoryRouter, RouterProvider } from '@/core/router/router';
import { db } from '@/mocks/db';
import { encodeToken } from '@/mocks/utils';
import { storage } from '@/shared/lib/storage';

type SignInAs = 'admin' | 'member';

/** Signs a seeded user in (sets the token the API client sends). */
export function signInAs(who: SignInAs = 'admin') {
  const user = db.users.find((u) => u.role === (who === 'admin' ? 'ADMIN' : 'USER'))!;
  storage.set(TOKEN_KEY, encodeToken(user.id));
  return user;
}

/** The real client (same meta handling as the app) without retries. */
export const createTestQueryClient = () => createQueryClient({ retry: false, gcTime: Infinity });

type RenderOptions = {
  /** Initial URL, e.g. '/app/tasks?page=2'. */
  url?: string;
  /** Route pattern the UI is mounted on, e.g. '/app/tasks/:taskId'. */
  path?: string;
  /** Sign a seeded user in before rendering. */
  user?: SignInAs;
};

/**
 * Renders a component with every app provider and a memory router.
 * Use it to test a component or page in isolation.
 */
export async function renderWithProviders(
  ui: ReactElement,
  { url = '/', path = '/', user }: RenderOptions = {},
) {
  const signedIn = user ? signInAs(user) : null;
  const queryClient = createTestQueryClient();
  const router = createMemoryRouter(
    [
      { path, element: ui },
      { path: '*', element: <div>Navigated away</div> },
    ],
    { initialEntries: [url] },
  );

  const result = render(
    <Providers queryClient={queryClient}>
      <RouterProvider router={router} />
    </Providers>,
  );
  await waitForLoadingToFinish();

  return { ...result, user: signedIn, router, queryClient, userEvent: userEvent.setup() };
}

/**
 * Renders the REAL app (route tree from the module registry, guards, shell)
 * at a URL. Use it for flows that cross pages.
 */
export async function renderApp(url: string, { user }: { user?: SignInAs } = {}) {
  const signedIn = user ? signInAs(user) : null;
  const queryClient = createTestQueryClient();
  const router = createMemoryRouter(createAppRoutes(queryClient), { initialEntries: [url] });

  const result = render(
    <Providers queryClient={queryClient}>
      <RouterProvider router={router} />
    </Providers>,
  );

  return { ...result, user: signedIn, router, queryClient, userEvent: userEvent.setup() };
}

export async function waitForLoadingToFinish() {
  const loaders = [...screen.queryAllByRole('status'), ...screen.queryAllByTestId('loading')];
  if (loaders.length) await waitForElementToBeRemoved(loaders, { timeout: 4000 });
}

export * from '@testing-library/react';
export { userEvent };
