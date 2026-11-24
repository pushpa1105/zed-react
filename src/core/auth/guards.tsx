import type { ReactNode } from 'react';

import { HOME_AFTER_LOGIN, routes } from '@/core/config/routes';
import { Navigate, useLocation, useSearchParams } from '@/core/router/router';
import { PageLoader } from '@/shared/components/page-loader';

import { hasRole } from './access';
import { useSession, type Role } from './session';

/** Renders children only for signed-in users (optionally with one of `roles`). */
export function RequireAuth({
  children,
  roles,
  forbidden = null,
}: {
  children: ReactNode;
  roles?: readonly Role[];
  forbidden?: ReactNode;
}) {
  const session = useSession();
  const location = useLocation();

  if (session.isPending) return <PageLoader />;

  if (!session.data) {
    return (
      <Navigate
        to={routes.login.href({ redirectTo: location.pathname + location.search })}
        replace
      />
    );
  }

  if (!hasRole(session.data, roles)) return forbidden;

  return children;
}

/** Renders children only for signed-out users (login, register…). */
export function RequireGuest({ children }: { children: ReactNode }) {
  const session = useSession();
  const [searchParams] = useSearchParams();

  if (session.isPending) return <PageLoader />;

  if (session.data) {
    return <Navigate to={safeRedirect(searchParams.get('redirectTo'))} replace />;
  }

  return children;
}

/** Only allow same-origin, in-app redirects (prevents open-redirect attacks). */
export function safeRedirect(target: string | null | undefined): string {
  if (target && target.startsWith('/') && !target.startsWith('//')) return target;
  return HOME_AFTER_LOGIN.href();
}
