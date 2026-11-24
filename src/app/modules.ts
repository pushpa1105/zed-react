import type { FeatureModule } from '@/core/feature/define-feature';
import auth from '@/features/auth';
import dashboard from '@/features/dashboard';
import settings from '@/features/settings';
import tasks from '@/features/tasks';
import users from '@/features/users';

/**
 * THE MODULE REGISTRY: the only list of features in the app.
 *
 * Add a feature: create `src/features/<name>/index.ts` and add it here
 * (`npm run generate` does both). Remove one: delete the line and the folder.
 * Routes, sidebar, ⌘K commands and translations follow automatically.
 */
export const modules: FeatureModule[] = [auth, dashboard, tasks, users, settings];
