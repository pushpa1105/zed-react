import { useCurrentUser } from '@/core/auth/session';
import type { PageModule } from '@/core/feature/define-feature';
import { useTranslation } from '@/core/i18n/use-translation';
import { Page } from '@/core/layout/page';

import { statsQuery } from '../api/stats';
import { CompletionCard } from '../components/completion-card';
import { StatCards } from '../components/stat-cards';

export const loader: PageModule['loader'] =
  ({ queryClient }) =>
  async () => {
    // prefetchQuery never throws: the page renders its own loading/error states.
    await queryClient.prefetchQuery(statsQuery());
    return null;
  };

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const user = useCurrentUser();

  return (
    <Page title={t('welcome', { name: user.firstName })} description={t('description')}>
      <StatCards />
      <div className="grid gap-4 lg:grid-cols-3">
        <CompletionCard />
      </div>
      <p className="text-sm text-muted-foreground">{t('role', { role: user.role })}</p>
    </Page>
  );
}
