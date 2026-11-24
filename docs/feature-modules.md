# Feature modules

A feature tells the app what it contributes through a **manifest**: the default export of
`src/features/<name>/index.ts`. The app reads the manifests from the registry
(`src/app/modules.ts`) and builds the router, sidebar, command menu and translations from them.

```ts
// src/features/tasks/index.ts
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
      keywords: ['new', 'add'],
    },
  ],
  i18n: { en, es },
});
```

## Reference

The contract is defined in [`src/core/feature/define-feature.ts`](../src/core/feature/define-feature.ts).

### `id` (required)

A unique string. It is also the feature's **i18n namespace** (`t('tasks:...')`).

### `routes`

| Field    | Type                                 | Meaning                                                         |
| -------- | ------------------------------------ | --------------------------------------------------------------- |
| `path`   | `string`                             | Absolute path. Take it from `routes` in `core/config/routes.ts` |
| `access` | `'public' \| 'guest' \| 'protected'` | Who can open it (see below)                                     |
| `page`   | `() => import('./pages/x')`          | Lazy page module. It becomes its own JS chunk                   |
| `roles`  | `Role[]` (optional)                  | Only these roles. Others see a "no access" screen               |

| `access`    | Who              | Rendered inside           |
| ----------- | ---------------- | ------------------------- |
| `public`    | everyone         | nothing (full page)       |
| `guest`     | signed-out users | the auth shell (centered) |
| `protected` | signed-in users  | the app shell (sidebar)   |

A **page module** exports the component as `default` and optionally a `loader`. The loader
prefetches data while the page code downloads:

```tsx
export const loader: PageModule['loader'] =
  ({ queryClient }) =>
  async ({ params, request }) => {
    await queryClient.prefetchQuery(taskQuery(params.taskId!));
    return null;
  };

export default function TaskPage() {
  /* … */
}
```

### `nav`

Sidebar entries. They also appear under "Pages" in the ⌘K menu.

| Field   | Meaning                                                           |
| ------- | ----------------------------------------------------------------- |
| `to`    | Link target (`routes.x.href()`)                                   |
| `icon`  | A `lucide-react` icon component                                   |
| `label` | `(t) => t('ns:key')`: type-checked and switches with the language |
| `order` | Sort position (lower first). Dashboard is 10, Settings is 100     |
| `roles` | Show only to these roles                                          |

### `commands`

Extra ⌘K actions. Each one navigates to a URL, and the target page reacts to it. For example,
`?new=1` opens the "New task" dialog. Fields: `id`, `to`, `icon`, `label`, `keywords`, `roles`.

### `i18n`

`{ en, es }` JSON trees. English is required because it is the fallback language. Register the
English file's type in `src/app/i18n-resources.d.ts` to get typed keys (the generator does this).

## Adding a feature

`npm run generate` → `feature` → name. It creates the module and wires it in. See the
[tutorial](adding-a-feature.md). By hand:

1. Create `src/features/<name>/index.ts` exporting `defineFeature({...})`.
2. Add a route in `src/core/config/routes.ts`.
3. Import the manifest in `src/app/modules.ts` and add it to the array.
4. Add the namespace to `src/app/i18n-resources.d.ts`.

## Removing a feature

1. Delete its line (and import) from `src/app/modules.ts`.
2. Delete `src/features/<name>/`.
3. Delete its routes from `src/core/config/routes.ts` and its line in `i18n-resources.d.ts`.
4. Optionally delete its mock handlers in `src/mocks/handlers/`.

`npm run typecheck` then lists anything that still referenced it. That can only be `app` or
tests, because other features can't import it.

To **disable** a feature temporarily, just remove it from the `modules` array.

## Safety net

`validateModules()` ([`src/app/registry.ts`](../src/app/registry.ts)) runs in a unit test and at
dev startup. It reports:

- duplicate ids
- two modules declaring the same path
- `nav`/`commands` links that match no route
- modules missing a language

The translations test also checks that every language has exactly the same keys as English.

## Communication between features

Features can't import each other. When one needs something from another:

| Need                           | Do this                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------- |
| Link to another feature's page | Use the typed route table: `routes.task.href({ taskId })`                         |
| Show the current user          | `useSession()` / `useCurrentUser()` from `core/auth`                              |
| Refresh another feature's data | Share a query-key root, or use a short `staleTime` (see `dashboard/api/stats.ts`) |
| Reuse a UI component           | Move it to `shared/components` (generic) or `core` (app-specific)                 |
| Put two features on one page   | Compose them in `app/` (the only layer allowed to know both)                      |
