import { Pencil, Trash2 } from 'lucide-react';

import { useCan } from '@/core/auth/access';
import { useTranslation } from '@/core/i18n/use-translation';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { Button } from '@/shared/ui/button';

import { useDeleteTask } from '../api/tasks-queries';
import type { Task } from '../model/task';
import { taskPolicies } from '../model/task-policies';

import { TaskDialog } from './task-dialog';

/** Edit + delete buttons, each shown only if the user's policy allows it. */
export function TaskActions({ task, onDeleted }: { task: Task; onDeleted?: () => void }) {
  const { t } = useTranslation(['tasks', 'common']);
  const canUpdate = useCan(taskPolicies.update, task);
  const canDelete = useCan(taskPolicies.delete, task);
  const deleteTask = useDeleteTask({ onSuccess: onDeleted });

  return (
    <div className="flex justify-end">
      {canUpdate && (
        <TaskDialog
          task={task}
          trigger={
            <Button variant="ghost" size="icon" aria-label={t('common:actions.edit')}>
              <Pencil />
            </Button>
          }
        />
      )}
      {canDelete && (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon" aria-label={t('common:actions.delete')}>
              <Trash2 className="text-destructive" />
            </Button>
          }
          title={t('delete.title')}
          description={t('delete.description', { title: task.title })}
          confirmLabel={t('common:actions.delete')}
          cancelLabel={t('common:actions.cancel')}
          destructive
          pending={deleteTask.isPending}
          onConfirm={() => deleteTask.mutateAsync(task.id)}
        />
      )}
    </div>
  );
}
