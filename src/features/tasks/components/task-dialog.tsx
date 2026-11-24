import { useId, type ReactNode } from 'react';

import { useTranslation } from '@/core/i18n/use-translation';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Spinner } from '@/shared/ui/spinner';

import { useCreateTask, useUpdateTask } from '../api/tasks-queries';
import type { Task, TaskInput } from '../model/task';

import { TaskForm } from './task-form';

type TaskDialogProps = {
  /** Edit this task; omit to create a new one. */
  task?: Task;
  trigger?: ReactNode;
  /** Optional controlled state (e.g. opened from the URL / command menu). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** One dialog for both creating and editing a task. */
export function TaskDialog({ task, trigger, open, onOpenChange }: TaskDialogProps) {
  const { t } = useTranslation(['tasks', 'common']);
  const formId = useId();
  const internal = useDisclosure();
  const isOpen = open ?? internal.isOpen;
  const setOpen = onOpenChange ?? internal.setIsOpen;

  const close = { onSuccess: () => setOpen(false) };
  const createTask = useCreateTask(close);
  const updateTask = useUpdateTask(close);
  const pending = createTask.isPending || updateTask.isPending;

  const submit = (input: TaskInput) =>
    task ? updateTask.mutate({ taskId: task.id, input }) : createTask.mutate(input);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? t('edit') : t('new')}</DialogTitle>
          <DialogDescription>{task ? task.title : t('formDescription')}</DialogDescription>
        </DialogHeader>
        <TaskForm id={formId} defaultValues={task} onSubmit={submit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('common:actions.cancel')}</Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={pending}>
            {pending && <Spinner />} {task ? t('common:actions.save') : t('common:actions.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
