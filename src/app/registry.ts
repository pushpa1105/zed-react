import { hasRole } from '@/core/auth/access';
import type { User } from '@/core/auth/session';
import type {
  FeatureCommand,
  FeatureModule,
  FeatureNavItem,
  FeatureRoute,
  RouteAccess,
} from '@/core/feature/define-feature';
import { LANGUAGES } from '@/core/i18n/languages';

/** Pure helpers that turn feature manifests into what the app shell needs. */

export const getRoutes = (modules: FeatureModule[], access: RouteAccess): FeatureRoute[] =>
  modules.flatMap((m) => m.routes ?? []).filter((r) => r.access === access);

export const getNavItems = (modules: FeatureModule[], user: User | null | undefined) =>
  modules
    .flatMap((m) => m.nav ?? [])
    .filter((item) => hasRole(user, item.roles))
    .sort((a, b) => (a.order ?? 50) - (b.order ?? 50));

export const getCommands = (modules: FeatureModule[], user: User | null | undefined) =>
  modules.flatMap((m) => m.commands ?? []).filter((command) => hasRole(user, command.roles));

export const getTranslations = (modules: FeatureModule[]) =>
  Object.fromEntries(modules.filter((m) => m.i18n).map((m) => [m.id, m.i18n!]));

/**
 * Checks the registry for mistakes that would otherwise fail silently:
 * duplicate ids/paths, nav or commands pointing nowhere, missing languages.
 * Runs in a unit test and in development at startup.
 */
export function validateModules(modules: FeatureModule[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const paths = new Map<string, string>();

  for (const m of modules) {
    if (ids.has(m.id)) problems.push(`Duplicate module id "${m.id}"`);
    ids.add(m.id);

    for (const route of m.routes ?? []) {
      const owner = paths.get(route.path);
      if (owner) problems.push(`Path "${route.path}" is declared by "${owner}" and "${m.id}"`);
      paths.set(route.path, m.id);
    }

    for (const { code } of LANGUAGES) {
      if (m.i18n && !m.i18n[code]) problems.push(`Module "${m.id}" has no "${code}" translations`);
    }
  }

  const matchesRoute = (to: string) => {
    const pathname = to.split('?')[0]!;
    return [...paths.keys()].some((pattern) =>
      new RegExp(`^${pattern.replace(/:\w+/g, '[^/]+')}$`).test(pathname),
    );
  };

  const links: Array<FeatureNavItem | FeatureCommand> = modules.flatMap((m) => [
    ...(m.nav ?? []),
    ...(m.commands ?? []),
  ]);
  for (const link of links) {
    if (!matchesRoute(link.to)) problems.push(`Link "${link.to}" does not match any route`);
  }

  return problems;
}
