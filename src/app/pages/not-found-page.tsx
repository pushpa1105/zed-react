import { routes } from '@/core/config/routes';
import { useTranslation } from '@/core/i18n/use-translation';
import { Head } from '@/core/layout/head';
import { Link } from '@/core/router/router';
import { Button } from '@/shared/ui/button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <Head title={t('errors.notFound')} />
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">{t('errors.notFound')}</h1>
      <p className="max-w-md text-muted-foreground">{t('errors.notFoundDescription')}</p>
      <Button asChild>
        <Link to={routes.home.href()} replace>
          {t('errors.goHome')}
        </Link>
      </Button>
    </div>
  );
}
