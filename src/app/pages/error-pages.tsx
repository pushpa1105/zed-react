import { ShieldX, TriangleAlert } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { useTranslation } from '@/core/i18n/use-translation';
import { Head } from '@/core/layout/head';
import { isRouteErrorResponse, Link, useRouteError } from '@/core/router/router';
import { Button } from '@/shared/ui/button';

/** Last-resort fallback for the top-level error boundary. */
export function AppErrorFallback() {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center"
    >
      <TriangleAlert className="size-10 text-destructive" />
      <h2 className="text-2xl font-semibold">{t('errors.somethingWrong')}</h2>
      <p className="max-w-md text-muted-foreground">{t('errors.somethingWrongDescription')}</p>
      <Button onClick={() => window.location.assign(window.location.origin)}>
        {t('errors.refresh')}
      </Button>
    </div>
  );
}

/** Error element for route segments: errors thrown by loaders or pages. */
export function RouteError() {
  const { t } = useTranslation();
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : t('errors.somethingWrongDescription');

  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 p-10 text-center">
      <h2 className="text-xl font-semibold">{t('errors.somethingWrong')}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        {t('errors.refresh')}
      </Button>
    </div>
  );
}

/** Shown when a signed-in user lacks the role a route requires. */
export function ForbiddenPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
      <Head title={t('errors.forbidden')} />
      <ShieldX className="size-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold">{t('errors.forbidden')}</h1>
      <Button variant="outline" asChild>
        <Link to={routes.app.href()}>{t('errors.goHome')}</Link>
      </Button>
    </div>
  );
}
