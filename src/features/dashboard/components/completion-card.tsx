import { useTranslation } from '@/core/i18n/use-translation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { useStats } from '../api/stats';

/** Progress visualisation in plain Tailwind (no chart library needed). */
export function CompletionCard() {
  const { t } = useTranslation('dashboard');
  const { data } = useStats();
  const percent = data?.total ? Math.round((data.done / data.total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('completion.title')}</CardTitle>
        <CardDescription>{t('completion.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-4xl font-semibold tabular-nums">{percent}%</p>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('completion.title')}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
