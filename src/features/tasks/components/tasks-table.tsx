import { ListTodo } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { useTranslation } from '@/core/i18n/use-translation';
import { Link } from '@/core/router/router';
import { formatRelative } from '@/shared/lib/format';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import type { Task } from '../model/task';

import { TaskActions } from './task-actions';
import { TaskPriorityBadge, TaskStatusBadge } from './task-badges';

export function TasksTable({ tasks, isPending }: { tasks?: Task[]; isPending: boolean }) {
  const { t } = useTranslation('tasks');

  if (isPending) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListTodo />
          </EmptyMedia>
          <EmptyTitle>{t('empty.title')}</EmptyTitle>
          <EmptyDescription>{t('empty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.title')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('table.priority')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('table.created')}</TableHead>
            <TableHead className="w-24 text-right">
              <span className="sr-only">{t('table.actions')}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <Link to={routes.task.href({ taskId: task.id })} className="hover:underline">
                  {task.title}
                </Link>
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {formatRelative(task.createdAt)}
              </TableCell>
              <TableCell>
                <TaskActions task={task} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
