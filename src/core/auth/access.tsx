import type { ReactNode } from 'react';

import { useSession, type Role, type User } from './session';

/**
 * Access control in two flavors:
 *
 * - Roles: coarse, "is this user an ADMIN?"            → `hasRole(user, ['ADMIN'])`
 * - Policies: fine-grained, "can they edit THIS task?" → `definePolicy(...)`
 *
 * Features declare their own policies next to their model
 * (e.g. `features/tasks/model/task-policies.ts`) and check them with
 * `useCan(policy, resource)` or `<Can policy={...} resource={...}>`.
 *
 * Client checks are for UX only. The server must enforce the same rules.
 */

export type Policy<R = void> = (user: User, resource: R) => boolean;

export const definePolicy = <R = void,>(policy: Policy<R>) => policy;

export function hasRole(user: User | null | undefined, roles?: readonly Role[]) {
  if (!user) return false;
  return !roles?.length || roles.includes(user.role);
}

/** Common building blocks for policies. */
export const rules = {
  isAdmin: (user: User) => user.role === 'ADMIN',
  isOwner: (user: User, resource: { authorId: string }) => resource.authorId === user.id,
};

export function useCan<R>(policy: Policy<R>, resource: R): boolean {
  const { data: user } = useSession();
  return !!user && policy(user, resource);
}

export function useHasRole(roles?: readonly Role[]) {
  const { data: user } = useSession();
  return hasRole(user, roles);
}

type CanProps<R> = {
  children: ReactNode;
  fallback?: ReactNode;
} & (
  | { policy: Policy<R>; resource: R; roles?: never }
  | { roles: readonly Role[]; policy?: never; resource?: never }
);

/** Renders `children` only when the current user passes the policy or role check. */
export function Can<R>({ children, fallback = null, ...check }: CanProps<R>) {
  const { data: user } = useSession();
  const allowed = check.policy
    ? !!user && check.policy(user, check.resource as R)
    : hasRole(user, check.roles);
  return allowed ? children : fallback;
}
