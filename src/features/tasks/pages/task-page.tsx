import { ArrowLeft } from 'lucide-react';

import { routes } from '@/core/config/routes';
import type { PageModule } from '@/core/feature/define-feature';
import { useTranslation } from '@/core/i18n/use-translation';
import { Head } from '@/core/layout/head';
import { Link, useNavigate, useParams } from '@/core/router/router';
import { formatDate } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

import { taskQuery, useTask } from '../api/tasks-queries';
import { TaskActions } from '../components/task-actions';
import { TaskPriorityBadge, TaskStatusBadge } from '../components/task-badges';

export const loader: PageModule['loader'] =
  ({ queryClient }) =>
  async ({ params }) => {
    if (params.taskId) await queryClient.prefetchQuery(taskQuery(params.taskId));
    return null;
  };

export default function TaskPage() {
  const { t } = useTranslation('tasks');
  const navigate = useNavigate();
  const { taskId = '' } = useParams<{ taskId: string }>();
  const task = useTask(taskId);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4 md:p-8">
      <Button variant="ghost" size="sm" asChild>
        <Link to={routes.tasks.href()}>
          <ArrowLeft /> {t('detail.back')}
        </Link>
      </Button>

      {task.isPending ? (
        <Skeleton className="h-48 w-full" />
      ) : !task.data ? (
        <p className="text-muted-foreground">{t('detail.notFound')}</p>
      ) : (
        <Card>
          <Head title={task.data.title} />
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl">{task.data.title}</CardTitle>
              <CardDescription>
                {t('detail.created', { date: formatDate(task.data.createdAt) })}
              </CardDescription>
              <div className="flex gap-2">
                <TaskStatusBadge status={task.data.status} />
                <TaskPriorityBadge priority={task.data.priority} />
              </div>
            </div>
            <TaskActions
              task={task.data}
              onDeleted={() => void navigate(routes.tasks.href(), { replace: true })}
            />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">
              {task.data.description || (
                <span className="text-muted-foreground italic">{t('detail.noDescription')}</span>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
