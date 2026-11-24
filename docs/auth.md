# Auth & permissions

## Where things live

| Piece                                  | Location                              |
| -------------------------------------- | ------------------------------------- |
| Session queries/mutations, `User` type | `core/auth/session.ts`                |
| Route guards, `safeRedirect`           | `core/auth/guards.tsx`                |
| Roles, policies, `useCan`, `<Can>`     | `core/auth/access.tsx`                |
| Sign-in / sign-up screens              | `features/auth/`                      |
| Feature policies                       | `features/<name>/model/*-policies.ts` |

## The session

```ts
const { data: user, isPending } = useSession(); // User | null
const user = useCurrentUser();                  // User; only below RequireAuth
const signIn = useSignIn();   signIn.mutate({ email, password });
const signUp = useSignUp();
const signOut = useSignOut(); signOut.mutate();
```

- The session is a TanStack query (`sessionKeys.user`) with `staleTime: Infinity`. It is fetched
  from `/auth/me` once, and it is skipped entirely when there is no token.
- Sign-in stores the JWT through `storage` and writes the user into the cache, so there is no
  extra request.
- Sign-out clears the token and **the whole query cache**, so no data leaks to the next user.
- A 401 from any request clears the token and triggers the unauthorized handler (see
  [Routing](routing.md#session-expiry)).

### Token vs cookies

By default the client sends a bearer token _and_ `withCredentials`. For httpOnly cookie sessions,
delete the token handling in `core/api/client.ts` (request interceptor) and `core/auth/session.ts`
(`storage.set/remove(TOKEN_KEY)`, and the early return in `fetchSession`).

## Guards

`RequireAuth` and `RequireGuest` wrap the route tree in `app/routes.tsx`. You rarely use them
directly. Declare `access` and `roles` in manifests instead:

```ts
{ path: routes.users.path, access: 'protected', roles: ['ADMIN'], page: () => import('./pages/users-page') }
```

## Roles (coarse)

Roles are defined by `roleSchema` in `core/auth/session.ts` (`ADMIN`, `USER`). To add one, extend
the enum. TypeScript then points at every place that needs a decision.

```tsx
const isAdmin = useHasRole(['ADMIN']);
<Can roles={['ADMIN']}>…</Can>
```

The manifest `roles` field filters routes, nav items and commands.

## Policies (fine-grained)

A policy answers "can _this_ user do _this_ to _this_ resource?". Features define their own:

```ts
// features/tasks/model/task-policies.ts
export const taskPolicies = {
  update: definePolicy<Pick<Task, 'authorId'>>(
    (user, task) => rules.isAdmin(user) || rules.isOwner(user, task),
  ),
};
```

```tsx
const canEdit = useCan(taskPolicies.update, task);

<Can policy={taskPolicies.update} resource={task} fallback={<ReadOnlyBadge />}>
  <EditButton />
</Can>;
```

`rules` (`isAdmin`, `isOwner`) are reusable building blocks. Policies are plain functions, so
they are easy to unit-test.

> **Client checks are for UX only.** Always enforce the same rules on the server. The mock
> backend does: it returns 403 when a member edits someone else's task.

## Security notes

- Tokens live in `localStorage` for simplicity. For high-security apps, prefer httpOnly, `Secure`,
  `SameSite` cookies set by the server.
- `redirectTo` is validated by `safeRedirect` (same-origin paths only).
- `VITE_APP_*` variables end up in the browser bundle. Never put secrets in them.
