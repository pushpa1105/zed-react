import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/core/i18n/use-translation';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { TASK_STATUSES, type TaskFilters, type TaskStatus } from '../model/task';

const ALL = 'all';

type TasksToolbarProps = {
  filters: TaskFilters;
  onChange: (next: Partial<TaskFilters>) => void;
};

export function TasksToolbar({ filters, onChange }: TasksToolbarProps) {
  const { t } = useTranslation('tasks');
  const [search, setSearch] = useState(filters.q ?? '');
  const debounced = useDebounce(search, 300);

  useEffect(() => {
    if (debounced !== (filters.q ?? '')) onChange({ q: debounced || undefined });
    // Only react to the debounced value; filters.q changes as a result of it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative max-w-xs flex-1">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('filters.search')}
          aria-label={t('filters.search')}
          className="pl-8"
        />
      </div>
      <Select
        value={filters.status ?? ALL}
        onValueChange={(value) =>
          onChange({ status: value === ALL ? undefined : (value as TaskStatus) })
        }
      >
        <SelectTrigger className="w-44" aria-label={t('filters.status')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('filters.allStatuses')}</SelectItem>
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {t(`status.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
