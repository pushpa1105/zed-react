import { useTranslation } from '@/core/i18n/use-translation';
import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/badge';

import type { TaskPriority, TaskStatus } from '../model/task';

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/15 text-primary',
  done: 'bg-success/15 text-success',
};

const priorityStyles: Record<TaskPriority, string> = {
  low: 'border-border text-muted-foreground',
  medium: 'border-warning/40 text-warning',
  high: 'border-destructive/40 text-destructive',
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { t } = useTranslation('tasks');
  return (
    <Badge variant="secondary" className={cn('border-transparent', statusStyles[status])}>
      {t(`status.${status}`)}
    </Badge>
  );
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const { t } = useTranslation('tasks');
  return (
    <Badge variant="outline" className={priorityStyles[priority]}>
      {t(`priority.${priority}`)}
    </Badge>
  );
}
