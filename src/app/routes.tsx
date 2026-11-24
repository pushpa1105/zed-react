import type { QueryClient } from '@tanstack/react-query';

import { RequireAuth, RequireGuest } from '@/core/auth/guards';
import { HOME_AFTER_LOGIN, routes } from '@/core/config/routes';
import type { FeatureModule, FeatureRoute } from '@/core/feature/define-feature';
import { Outlet, redirect, type RouteObject } from '@/core/router/router';
import { PageLoader } from '@/shared/components/page-loader';

import { modules as registeredModules } from './modules';
import { ForbiddenPage, RouteError } from './pages/error-pages';
import { getRoutes } from './registry';
import { AppShell } from './shell/app-shell';
import { AuthShell } from './shell/auth-shell';

/** Turns a feature route into a lazy route object (code-split, optional loader). */
function toRouteObject(route: FeatureRoute, queryClient: QueryClient): RouteObject {
  const page: RouteObject = {
    path: route.path,
    lazy: async () => {
      const { default: Component, loader } = await route.page();
      return { Component, loader: loader?.({ queryClient }) };
    },
  };

  if (!route.roles) return page;

  // Role-restricted: wrap the page in a guard layout.
  return {
    element: (
      <RequireAuth roles={route.roles} forbidden={<ForbiddenPage />}>
        <Outlet />
      </RequireAuth>
    ),
    children: [page],
  };
}

/**
 * The whole route tree, assembled from the module registry:
 *
 *   /                 landing (+ every `public` feature route)
 *   (guest layout)    every `guest` route, e.g. /login, /register
 *   /app              app shell + every `protected` route
 *   *                 404
 */
export function createAppRoutes(
  queryClient: QueryClient,
  modules: FeatureModule[] = registeredModules,
): RouteObject[] {
  const routesFor = (access: FeatureRoute['access']) =>
    getRoutes(modules, access).map((route) => toRouteObject(route, queryClient));

  return [
    {
      HydrateFallback: PageLoader,
      errorElement: <RouteError />,
      children: [
        {
          path: routes.home.path,
          lazy: () => import('./pages/landing-page').then((m) => ({ Component: m.default })),
        },
        ...routesFor('public'),
        {
          element: (
            <RequireGuest>
              <AuthShell />
            </RequireGuest>
          ),
          children: routesFor('guest'),
        },
        {
          path: routes.app.path,
          element: (
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          ),
          children: [
            {
              errorElement: <RouteError />, // keeps the shell visible when a page fails
              children: [
                { index: true, loader: () => redirect(HOME_AFTER_LOGIN.href()) },
                ...routesFor('protected'),
              ],
            },
          ],
        },
        {
          path: '*',
          lazy: () => import('./pages/not-found-page').then((m) => ({ Component: m.default })),
        },
      ],
    },
  ];
}
