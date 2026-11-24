# zed-react

A modular React starter built around **self-contained feature modules**. Each feature declares
what it contributes: routes, navigation, ⌘K commands, permissions and translations. The app
assembles them. Every third-party library sits behind **one adapter file**, so swapping a library
is a one-file change.

**Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · TanStack Query ·
React Router · Zod · React Hook Form · i18next · Zustand · MSW · Vitest · Playwright

```bash
npm install
cp .env.example .env    # the mock backend is on by default: no server needed
npm run dev             # http://localhost:3000
```

Sign in with **`demo@example.com` / `password`** (admin) or **`member@example.com` / `password`**
(regular member), or create an account.

---

## Why it is built this way

| Goal                                              | How zed-react gets there                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Add or remove a feature in one step               | Feature **manifests** + a single **module registry**. Routes, sidebar, ⌘K and i18n follow on their own |
| Replace a library without a rewrite               | **Adapters**: axios, router, i18n, toasts and dates are each used through one file (lint-enforced)     |
| Catch backend changes early                       | Every API response is **validated with Zod**; types come from the same schemas                         |
| Keep the codebase from tangling                   | **Four layers** with one-way imports, checked by ESLint on every commit                                |
| Never ship a broken link or a missing translation | **Registry and translation-parity tests** fail the build                                               |
| Make the app yours quickly                        | A **live theme engine** (modes, presets, any brand color, radius, font, density) with CSS export       |

## What you get

- **Feature modules:** `defineFeature({ routes, nav, commands, i18n })`, with role-restricted routes and nav.
- **Typed routes:** `routes.task.href({ taskId })`. A missing param is a compile error.
- **API layer:**
  - Zod-validated responses and a single `ApiError` type.
  - Declarative mutations: `meta: { invalidates, successMessage }`.
- **Auth:**
  - Session, `RequireAuth` / `RequireGuest` guards and a safe `redirectTo`.
  - Roles, plus per-resource policies (`useCan(taskPolicies.delete, task)`).
- **Forms:** React Hook Form + Zod + a typed `TextField`, with translated validation messages.
- **i18n:** a namespace per feature, type-safe keys, EN/ES included, and a parity test that catches missing keys.
- **Theme engine:**
  - Light/dark/system, 6 presets and any custom color.
  - Radius, font and density.
  - No flash on load, and "Copy CSS" export.
- **App shell:** a collapsible sidebar and a **⌘K command palette**, both generated from the manifests.
- **Mock backend:** MSW with a persisted fake database. Tests use the same handlers.
- **Quality:**
  - Strict TypeScript, and ESLint layer, adapter and privacy rules.
  - Prettier, Husky, lint-staged and commitlint.
- **Tests:** Vitest + Testing Library (unit, integration and full-app routing) and Playwright E2E.
- **Generators:** `npm run generate` creates a complete feature, already registered and passing its test.
- **Delivery:** Dockerfile + nginx, and GitHub Actions CI.

## Project structure

```
src/
├── app/        Composition root: module registry, router, providers, shell (sidebar, ⌘K)
├── features/   Self-contained business features (auth, dashboard, tasks, users, settings)
├── core/       App infrastructure + library adapters (api, auth, router, i18n, theme, query…)
├── shared/     Generic building blocks (shadcn/ui, components, hooks, helpers)
├── mocks/      Fake backend (MSW) used in development and tests
├── testing/    Test setup and render helpers
└── styles/     Design tokens and theme presets
```

Imports only point downwards: **app → features → core → shared**. Features never import each
other. See [Architecture](docs/architecture.md).

## Scripts

| Script                  | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Start the dev server on port 3000                       |
| `npm run build`         | Typecheck and build for production into `dist/`         |
| `npm run preview`       | Serve the production build                              |
| `npm run typecheck`     | TypeScript only                                         |
| `npm run lint`          | ESLint (layers, adapters, feature privacy, hooks…)      |
| `npm run format`        | Prettier                                                |
| `npm test`              | Vitest in watch mode                                    |
| `npm run test:coverage` | Unit + integration tests with coverage                  |
| `npm run test:e2e`      | Playwright end-to-end tests                             |
| `npm run generate`      | Scaffold a feature or a component                       |
| `npm run check`         | Typecheck + lint + format check + tests (run before PR) |

## Documentation

**Start here**

1. [Getting started](docs/getting-started.md): install, configure, take the tour
2. [Architecture](docs/architecture.md): layers, rules and the reasons behind them
3. [Tutorial: build a feature](docs/adding-a-feature.md): from generator to finished CRUD

**Reference**

| Guide                                            | Topic                                              |
| ------------------------------------------------ | -------------------------------------------------- |
| [Feature modules](docs/feature-modules.md)       | The `defineFeature` contract, field by field       |
| [Swapping libraries](docs/swapping-libraries.md) | The adapter files and how to replace each library  |
| [Routing](docs/routing.md)                       | Typed routes, access levels, loaders, guards       |
| [Data fetching](docs/data-fetching.md)           | API client, schemas, queries, mutations, errors    |
| [Mock backend](docs/mock-backend.md)             | MSW handlers, fake database, connecting a real API |
| [Auth & permissions](docs/auth.md)               | Session, guards, roles and policies                |
| [Forms](docs/forms.md)                           | React Hook Form + Zod + `TextField`                |
| [State management](docs/state-management.md)     | Which state goes where                             |
| [i18n](docs/i18n.md)                             | Namespaces, typed keys, adding a language          |
| [Theming](docs/theming.md)                       | Tokens, presets, custom colors, the customizer     |
| [UI components](docs/ui-components.md)           | shadcn/ui, shared components, adding new ones      |
| [Testing](docs/testing.md)                       | Unit, integration, full-app and E2E tests          |
| [Conventions](docs/conventions.md)               | Naming, files, imports, commits                    |
| [Deployment](docs/deployment.md)                 | Env vars, Docker, static hosts, CI                 |
| [Troubleshooting](docs/troubleshooting.md)       | Common problems and fixes                          |
