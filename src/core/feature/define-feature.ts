import type { QueryClient } from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

import type { Role } from '@/core/auth/session';
import type { Language } from '@/core/i18n/languages';
import type { FlatNamespace, TFunction } from '@/core/i18n/use-translation';
import type { LoaderFunction } from '@/core/router/router';

/**
 * The contract between a feature and the app.
 *
 * A feature never touches the router, the sidebar or the i18n setup. It
 * *declares* what it contributes in its `index.ts`, and `src/app` assembles
 * every registered module:
 *
 *   export default defineFeature({
 *     id: 'tasks',
 *     routes: [{ path: routes.tasks.path, access: 'protected', page: () => import('./pages/tasks-page') }],
 *     nav: [{ to: routes.tasks.href(), icon: ListTodo, label: (t) => t('tasks:nav') }],
 *     i18n: { en, es },
 *   });
 */

/** What a lazily-loaded page module must export. */
export type PageModule = {
  default: ComponentType;
  /** Optional data preloader, run before the page renders (see docs/routing.md). */
  loader?: (ctx: { queryClient: QueryClient }) => LoaderFunction;
};

export type RouteAccess =
  /** Anyone. Rendered without the app shell. */
  | 'public'
  /** Signed-out users only (sign-in, sign-up…). Rendered in the auth shell. */
  | 'guest'
  /** Signed-in users only. Rendered inside the app shell. */
  | 'protected';

export type FeatureRoute = {
  /** Absolute path: take it from `routes` in `core/config/routes.ts`. */
  path: string;
  access: RouteAccess;
  page: () => Promise<PageModule>;
  /** Restrict a protected route to some roles. */
  roles?: readonly Role[];
};

/**
 * Translates a label. `t` accepts any key of any namespace, e.g. `t('tasks:nav')`.
 * Using a function keeps labels type-checked and reactive to language changes.
 */
export type LabelFn = (t: TFunction<FlatNamespace[]>) => string;

/**
 * Resolves a label with any component's `t`. At runtime every `t` accepts
 * namespaced keys; only the static type differs, hence the single cast here.
 */
export const translateLabel = (label: LabelFn, t: (...args: never[]) => unknown) =>
  label(t as unknown as TFunction<FlatNamespace[]>);

export type FeatureNavItem = {
  to: string;
  icon: LucideIcon;
  label: LabelFn;
  /** Lower comes first. */
  order?: number;
  roles?: readonly Role[];
};

/** Extra entries for the ⌘K command menu (nav items are included automatically). */
export type FeatureCommand = {
  id: string;
  to: string;
  icon: LucideIcon;
  label: LabelFn;
  keywords?: string[];
  roles?: readonly Role[];
};

type TranslationTree = { [key: string]: string | TranslationTree };

/** English is required (it is the fallback language); other languages are optional. */
export type FeatureTranslations = { en: TranslationTree } & Partial<
  Record<Exclude<Language, 'en'>, TranslationTree>
>;

export type FeatureModule = {
  /** Unique id. Also the i18n namespace of the feature. */
  id: string;
  routes?: FeatureRoute[];
  nav?: FeatureNavItem[];
  commands?: FeatureCommand[];
  i18n?: FeatureTranslations;
};

/** Identity helper that type-checks a feature manifest. */
export function defineFeature(feature: FeatureModule): FeatureModule {
  return feature;
}
