import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/core/api/client';

export const statsSchema = z.object({
  total: z.number(),
  todo: z.number(),
  inProgress: z.number(),
  done: z.number(),
});

export type Stats = z.infer<typeof statsSchema>;

export const statsQuery = () =>
  queryOptions({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.get('/stats', statsSchema),
    // Aggregates change whenever other features mutate data, and this feature
    // can't know about them, so always refetch when the dashboard mounts.
    staleTime: 0,
  });

export const useStats = () => useQuery(statsQuery());
