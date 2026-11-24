import { useCallback, useMemo } from 'react';

import { useSearchParams } from '@/core/router/router';

import { parseTaskFilters, type TaskFilters } from '../model/task';

/**
 * Task list filters stored in the URL, so the view is shareable, bookmarkable
 * and survives reloads. Changing any filter other than `page` resets paging.
 */
export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseTaskFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (next: Partial<TaskFilters>) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!('page' in next)) params.delete('page');
          for (const [key, value] of Object.entries(next)) {
            if (value === undefined || value === '' || (key === 'page' && value === 1)) {
              params.delete(key);
            } else {
              params.set(key, String(value));
            }
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [filters, setFilters] as const;
}
