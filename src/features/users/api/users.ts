import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/core/api/client';
import { userSchema } from '@/core/auth/session';

export const usersQuery = () =>
  queryOptions({
    queryKey: ['users', 'list'],
    queryFn: () => api.get('/users', z.array(userSchema)),
  });

export const useUsers = () => useQuery(usersQuery());
