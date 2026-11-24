import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createBrowserRouter, RouterProvider } from '@/core/router/router';

import { createAppRoutes } from './routes';

export function AppRouter() {
  const queryClient = useQueryClient();
  const router = useMemo(() => createBrowserRouter(createAppRoutes(queryClient)), [queryClient]);
  return <RouterProvider router={router} />;
}
