import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useTranslation } from '@/core/i18n/use-translation';
import type { MutationOptions } from '@/core/query/query-client';

import type { Task, TaskFilters, TaskInput } from '../model/task';

import { tasksApi } from './tasks-api';

/** Query keys are built in one place so invalidation stays consistent. */
export const tasksKeys = {
  all: ['tasks'] as const,
  lists: () => [...tasksKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...tasksKeys.lists(), filters] as const,
  detail: (taskId: string) => [...tasksKeys.all, 'detail', taskId] as const,
};

export const tasksQuery = (filters: TaskFilters) =>
  queryOptions({
    queryKey: tasksKeys.list(filters),
    queryFn: () => tasksApi.list(filters),
    placeholderData: keepPreviousData,
  });

export const taskQuery = (taskId: string) =>
  queryOptions({
    queryKey: tasksKeys.detail(taskId),
    queryFn: () => tasksApi.get(taskId),
  });

export const useTasks = (filters: TaskFilters) => useQuery(tasksQuery(filters));

export const useTask = (taskId: string) => useQuery(taskQuery(taskId));

export function useCreateTask(options?: MutationOptions<Task, TaskInput>) {
  const { t } = useTranslation('tasks');
  return useMutation({
    mutationFn: tasksApi.create,
    ...options,
    meta: {
      invalidates: [tasksKeys.lists()],
      successMessage: t('toast.created'),
      ...options?.meta,
    },
  });
}

export function useUpdateTask(
  options?: MutationOptions<Task, { taskId: string; input: Partial<TaskInput> }>,
) {
  const { t } = useTranslation('tasks');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.update,
    ...options,
    meta: {
      invalidates: [tasksKeys.lists()],
      successMessage: t('toast.updated'),
      ...options?.meta,
    },
    onSuccess: (task, ...rest) => {
      queryClient.setQueryData(tasksKeys.detail(task.id), task);
      return options?.onSuccess?.(task, ...rest);
    },
  });
}

export function useDeleteTask(options?: MutationOptions<unknown, string>) {
  const { t } = useTranslation('tasks');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.remove,
    ...options,
    meta: {
      invalidates: [tasksKeys.lists()],
      successMessage: t('toast.deleted'),
      ...options?.meta,
    },
    onSuccess: (data, taskId, ...rest) => {
      queryClient.removeQueries({ queryKey: tasksKeys.detail(taskId) });
      return options?.onSuccess?.(data, taskId, ...rest);
    },
  });
}
