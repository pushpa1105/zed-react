import { Plus } from 'lucide-react';

import type { PageModule } from '@/core/feature/define-feature';
import { useTranslation } from '@/core/i18n/use-translation';
import { Page } from '@/core/layout/page';
import { useSearchParams } from '@/core/router/router';
import { Pager } from '@/shared/components/pager';
import { Button } from '@/shared/ui/button';

import { tasksQuery, useTasks } from '../api/tasks-queries';
import { TaskDialog } from '../components/task-dialog';
import { TasksTable } from '../components/tasks-table';
import { TasksToolbar } from '../components/tasks-toolbar';
import { useTaskFilters } from '../hooks/use-task-filters';
import { parseTaskFilters } from '../model/task';

/** Starts fetching the list while the page code is still loading. */
export const loader: PageModule['loader'] =
  ({ queryClient }) =>
  async ({ request }) => {
    const filters = parseTaskFilters(new URL(request.url).searchParams);
    await queryClient.prefetchQuery(tasksQuery(filters));
    return null;
  };

export default function TasksPage() {
  const { t } = useTranslation(['tasks', 'common']);
  const [filters, setFilters] = useTaskFilters();
  const tasks = useTasks(filters);
  const meta = tasks.data?.meta;

  // `?new=1` opens the create dialog (used by the ⌘K "Create a task" command).
  const [searchParams, setSearchParams] = useSearchParams();
  const createOpen = searchParams.has('new');
  const setCreateOpen = (open: boolean) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (open) next.set('new', '1');
        else next.delete('new');
        return next;
      },
      { replace: true },
    );

  return (
    <Page
      title={t('page.title')}
      description={t('page.description')}
      actions={
        <TaskDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          trigger={
            <Button>
              <Plus /> {t('new')}
            </Button>
          }
        />
      }
    >
      <div className="space-y-4">
        <TasksToolbar filters={filters} onChange={setFilters} />
        <TasksTable tasks={tasks.data?.data} isPending={tasks.isPending} />
        {meta && (
          <Pager
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(page) => setFilters({ page })}
            labels={{
              previous: t('common:pager.previous'),
              next: t('common:pager.next'),
              status: t('common:pager.status', { page: meta.page, totalPages: meta.totalPages }),
            }}
          />
        )}
      </div>
    </Page>
  );
}
