import { ListTodo, Plus } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { defineFeature } from '@/core/feature/define-feature';

import en from './i18n/en.json';
import es from './i18n/es.json';

/**
 * Public API of the tasks feature: its manifest. This is the only file the
 * app imports; everything else in this folder is private to the feature.
 */
export default defineFeature({
  id: 'tasks',
  routes: [
    { path: routes.tasks.path, access: 'protected', page: () => import('./pages/tasks-page') },
    { path: routes.task.path, access: 'protected', page: () => import('./pages/task-page') },
  ],
  nav: [{ to: routes.tasks.href(), icon: ListTodo, label: (t) => t('tasks:nav'), order: 20 }],
  commands: [
    {
      id: 'tasks.create',
      to: routes.tasks.href({ new: 1 }),
      icon: Plus,
      label: (t) => t('tasks:commands.create'),
      keywords: ['new', 'add', 'todo'],
    },
  ],
  i18n: { en, es },
});
