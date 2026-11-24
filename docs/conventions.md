# Conventions

## Naming

| Thing             | Convention                    | Example                                  |
| ----------------- | ----------------------------- | ---------------------------------------- |
| Files & folders   | `kebab-case`                  | `task-dialog.tsx`, `use-task-filters.ts` |
| Components        | `PascalCase`, named export    | `export function TaskDialog()`           |
| Pages             | `default` export (+ `loader`) | `pages/tasks-page.tsx`                   |
| Hooks             | `useX`                        | `useTasks`, `useCan`                     |
| Zod schemas       | `xSchema`                     | `taskSchema`, `taskInputSchema`          |
| Types             | inferred from schemas         | `type Task = z.infer<typeof taskSchema>` |
| Query keys        | `xKeys` factory               | `tasksKeys.detail(id)`                   |
| Query options     | `xQuery`                      | `tasksQuery(filters)`                    |
| Request functions | `xApi` object                 | `tasksApi.create(input)`                 |
| Policies          | `xPolicies` object            | `taskPolicies.delete`                    |
| Constants         | `UPPER_SNAKE_CASE`            | `TASK_STATUSES`                          |
| i18n keys         | `camelCase`, nested by screen | `tasks:detail.notFound`                  |

## Inside a feature

```
model/       pure TypeScript: schemas, types, constants, policies (no React)
api/         <name>-api.ts (requests) and <name>-queries.ts (keys, options, hooks)
hooks/       feature hooks
components/  UI parts
pages/       route components
i18n/        translations
__tests__/   tests
index.ts     the manifest: the ONLY public entry point
```

## Imports

- Use the `@/` alias whenever you leave the current folder. `../../` is a lint error. Within a
  feature, `../model/task` is fine.
- No barrel files (`index.ts` re-exports), except each feature's manifest.
- Libraries with an adapter are imported through the adapter
  ([Swapping libraries](swapping-libraries.md)).
- `import type` for types (`@typescript-eslint/consistent-type-imports` autofixes it).
- Import order is enforced and autofixed: builtin → external → `@/…` → relative.

## Code style

- Prettier formats everything (single quotes, 100 columns, trailing commas, Tailwind classes
  sorted). Don't argue with it.
- Strict TypeScript, including `noUncheckedIndexedAccess`. `any` is a lint error. Use `unknown`
  and narrow it.
- Keep components small. Extract a hook when logic grows, and a component when markup grows.
- Never hard-code a URL (`routes.*.href()`) or a user-facing string (`t(...)`).

## Commits

[Conventional Commits](https://www.conventionalcommits.org), checked by commitlint:

```
feat(tasks): add due dates
fix(auth): keep redirectTo after sign-up
docs: explain adapters
refactor(core): split query client
```

Hooks (after `git init && npm install`):

| Hook         | Runs                                                   |
| ------------ | ------------------------------------------------------ |
| `pre-commit` | lint-staged: ESLint `--fix` + Prettier on staged files |
| `commit-msg` | commitlint                                             |

Before opening a PR: `npm run check`.
