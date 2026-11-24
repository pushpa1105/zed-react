import { definePolicy, rules } from '@/core/auth/access';

import type { Task } from './task';

/** Who may do what with a task. Mirrors the server rules (see mocks/handlers/tasks.ts). */
export const taskPolicies = {
  update: definePolicy<Pick<Task, 'authorId'>>(
    (user, task) => rules.isAdmin(user) || rules.isOwner(user, task),
  ),
  delete: definePolicy<Pick<Task, 'authorId'>>(
    (user, task) => rules.isAdmin(user) || rules.isOwner(user, task),
  ),
};
