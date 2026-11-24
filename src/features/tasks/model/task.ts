import { z } from 'zod';

import { entitySchema } from '@/core/api/schemas';

/*
 * The model is defined once, as Zod schemas. Types are inferred from them, and
 * the same schemas validate API responses, form input and URL parameters.
 */

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export const taskSchema = entitySchema.extend({
  title: z.string(),
  description: z.string(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  authorId: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

/** Create/edit form + request body. */
export const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'validation.required').max(120, 'validation.tooLong'),
  description: z.string().max(2000, 'validation.tooLong'),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export const EMPTY_TASK: TaskInput = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
};

/**
 * List filters live in the URL (?page=&q=&status=). Parsing them with a
 * schema means a hand-edited or stale URL can never break the page.
 */
export const taskFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  q: z.string().trim().optional().catch(undefined),
  status: z.enum(TASK_STATUSES).optional().catch(undefined),
});

export type TaskFilters = z.infer<typeof taskFiltersSchema>;

export const parseTaskFilters = (params: URLSearchParams): TaskFilters =>
  taskFiltersSchema.parse(Object.fromEntries(params));
