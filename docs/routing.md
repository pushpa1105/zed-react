# Routing

Routing uses React Router (data router), reached through the adapter
[`core/router/router.ts`](../src/core/router/router.ts). Import `Link`, `useNavigate`,
`useSearchParams` and the rest from there, never from `react-router`.

## The route table

Every URL is declared once, in [`core/config/routes.ts`](../src/core/config/routes.ts):

```ts
export const routes = {
  home: defineRoute('/'),
  login: defineRoute('/login'),
  dashboard: defineRoute('/app/dashboard'),
  task: defineRoute('/app/tasks/:taskId'),
  // …
};
```

`defineRoute` infers the params from the pattern:

```ts
routes.task.path;                                 // '/app/tasks/:taskId' (for manifests)
routes.task.href({ taskId: '42' });               // '/app/tasks/42'
routes.task.href({ taskId: '42' }, { tab: 'x' }); // '/app/tasks/42?tab=x'
routes.login.href({ redirectTo: '/app/tasks' });  // '/login?redirectTo=%2Fapp%2Ftasks'
routes.task.href({});                             // ✗ compile error: taskId is missing
```

Empty, `null` and `undefined` search values are dropped. Renaming a URL is a one-line change.

## How the tree is built

[`app/routes.tsx`](../src/app/routes.tsx) assembles the tree from the module registry:

```
(root: error element + hydrate fallback)
├── /                        landing page
├── …public feature routes
├── (RequireGuest + AuthShell)
│   └── …guest feature routes          /login, /register
├── /app (RequireAuth + AppShell)
│   └── (error boundary inside the shell)
│       ├── index → redirect to HOME_AFTER_LOGIN
│       └── …protected feature routes   (role-restricted ones get a guard)
└── *                        404
```

Every page is **lazy-loaded** into its own chunk. Errors in a protected page are caught _inside_
the shell, so the sidebar stays usable.

## Loaders: fetch while the code downloads

A page module can export `loader`. It receives the query client and returns a React Router
loader. Use `prefetchQuery`: it never throws, and the page still renders its own loading and
error states.

```tsx
export const loader: PageModule['loader'] =
  ({ queryClient }) =>
  async ({ request }) => {
    const filters = parseTaskFilters(new URL(request.url).searchParams);
    await queryClient.prefetchQuery(tasksQuery(filters));
    return null;
  };
```

Because the page reads the same `queryOptions`, it finds the data already in the cache.

## Guards

| Component      | Behavior                                                                    |
| -------------- | --------------------------------------------------------------------------- |
| `RequireAuth`  | Signed out → `/login?redirectTo=<current url>`. Wrong role → `forbidden`    |
| `RequireGuest` | Signed in → back to `redirectTo` (validated by `safeRedirect`) or dashboard |

`safeRedirect` only accepts same-origin paths (`/x`, not `//evil.com`), which prevents open
redirects. After signing in, the guest guard redirects by itself, so forms don't navigate.

Role-restricted routes come from the manifest: `{ ..., roles: ['ADMIN'] }`.

## URL state

Prefer the URL for anything shareable: filters, pagination, the active tab, open dialogs.

- **Tasks:** `useTaskFilters()` parses `?page=&q=&status=` with a Zod schema (`.catch()` defaults),
  so `?page=banana` falls back to page 1 instead of crashing.
- **Settings:** `?tab=profile` selects a tab, and ⌘K links straight to it.
- **Tasks:** `?new=1` opens the create dialog.

## Session expiry

When an API call returns 401 on an `/app` page, `main.tsx` sends the user to
`/login?redirectTo=<where they were>` (see `setUnauthorizedHandler` in `core/api/client.ts`).
