/**
 * Typed route table: the single source of truth for every URL in the app.
 *
 *   routes.task.path                        // '/app/tasks/:taskId'  (for the router)
 *   routes.task.href({ taskId: '42' })      // '/app/tasks/42'       (for links)
 *   routes.login.href({ redirectTo: '/x' }) // '/login?redirectTo=%2Fx'
 *
 * Params are inferred from the pattern, so a missing or misspelled param is a
 * compile error. Never hard-code a URL in a component.
 */

type ParamKeys<P extends string> = P extends `${string}:${infer Key}/${infer Rest}`
  ? Key | ParamKeys<`/${Rest}`>
  : P extends `${string}:${infer Key}`
    ? Key
    : never;

type SearchParams = Record<string, string | number | boolean | null | undefined>;

type HrefArgs<P extends string> = [ParamKeys<P>] extends [never]
  ? [search?: SearchParams]
  : [params: Record<ParamKeys<P>, string | number>, search?: SearchParams];

export type AppRoute<P extends string = string> = {
  path: P;
  href: (...args: HrefArgs<P>) => string;
};

function toQueryString(search?: SearchParams) {
  if (!search) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function defineRoute<P extends string>(path: P): AppRoute<P> {
  const hasParams = path.includes(':');

  return {
    path,
    href: (...args) => {
      const [params, search] = (hasParams ? args : [undefined, args[0]]) as [
        Record<string, string | number> | undefined,
        SearchParams | undefined,
      ];
      const pathname = path.replace(/:(\w+)/g, (_, key: string) => {
        const value = params?.[key];
        if (value === undefined) throw new Error(`Missing route param "${key}" for ${path}`);
        return encodeURIComponent(String(value));
      });
      return pathname + toQueryString(search);
    },
  };
}

/** Prefix of every authenticated page (they render inside the app shell). */
export const APP_PREFIX = '/app';

export const routes = {
  home: defineRoute('/'),

  // Guest-only (redirect to the app when already signed in)
  login: defineRoute('/login'),
  register: defineRoute('/register'),

  // Authenticated
  app: defineRoute(APP_PREFIX),
  dashboard: defineRoute('/app/dashboard'),
  tasks: defineRoute('/app/tasks'),
  task: defineRoute('/app/tasks/:taskId'),
  settings: defineRoute('/app/settings'),
  users: defineRoute('/app/users'),
} as const;

/** The page users land on after signing in. */
export const HOME_AFTER_LOGIN = routes.dashboard;
