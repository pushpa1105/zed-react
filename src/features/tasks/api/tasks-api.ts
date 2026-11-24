import { api } from '@/core/api/client';
import { paginated } from '@/core/api/schemas';

import { taskSchema, type TaskFilters, type TaskInput } from '../model/task';

/** Plain request functions: no React, easy to reuse in loaders and tests. */
export const tasksApi = {
  list: (filters: TaskFilters) => api.get('/tasks', paginated(taskSchema), { params: filters }),

  get: (taskId: string) => api.get(`/tasks/${taskId}`, taskSchema),

  create: (input: TaskInput) => api.post('/tasks', input, taskSchema),

  update: ({ taskId, input }: { taskId: string; input: Partial<TaskInput> }) =>
    api.patch(`/tasks/${taskId}`, input, taskSchema),

  remove: (taskId: string) => api.delete(`/tasks/${taskId}`),
};
