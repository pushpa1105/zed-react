# Testing

| Level       | Tool                                   | Location                       | Command                 |
| ----------- | -------------------------------------- | ------------------------------ | ----------------------- |
| Unit        | Vitest                                 | `**/__tests__/*.test.ts`       | `npm test`              |
| Integration | Vitest + Testing Library + MSW         | `**/__tests__/*.test.tsx`      | `npm test`              |
| Full app    | `renderApp()` (real router + registry) | `app/__tests__`, feature tests | `npm test`              |
| End-to-end  | Playwright (Chromium)                  | `e2e/*.spec.ts`                | `npm run test:e2e`      |
| Coverage    | `@vitest/coverage-v8`                  | `coverage/`                    | `npm run test:coverage` |

## What's covered out of the box

| Test file                              | Proves                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `app/__tests__/modules.test.ts`        | The registry is valid, and every language has every key                         |
| `app/__tests__/access.test.tsx`        | Guards redirect correctly, and admin-only pages and nav are hidden from members |
| `app/__tests__/command-menu.test.tsx`  | Ctrl+K opens the palette and runs a feature's command                           |
| `core/api/__tests__/client.test.ts`    | Responses are validated, and errors are normalized                              |
| `core/config/__tests__/routes.test.ts` | Typed hrefs, encoding, missing params                                           |
| `core/theme/__tests__/*`               | Theme engine, store and customizer                                              |
| `features/auth/__tests__/*`            | Validation, server errors, sign-in with `redirectTo`                            |
| `features/tasks/__tests__/*`           | List, URL filters, bad URLs, create, delete, `?new=1`, policies                 |
| `e2e/smoke.spec.ts`                    | Real browser: sign in, CRUD, theme persistence, ⌘K, roles                       |

## Two render helpers

From [`src/testing/test-utils.tsx`](../src/testing/test-utils.tsx):

```tsx
// A component (or page) in isolation, with every provider and a memory router.
const { userEvent } = await renderWithProviders(<SignInForm />, { user: 'admin' });

// The REAL app at a URL: registry, guards, shells, lazy pages.
const { userEvent, router } = await renderApp('/app/tasks?status=done', { user: 'member' });
expect(router.state.location.pathname).toBe('/app/tasks');
```

`user: 'admin' | 'member'` signs in a seeded account first. Both helpers use the app's real
query client (same `meta` handling) with retries turned off.

Prefer `renderApp` for anything involving navigation, permissions or URL state. It tests what
users actually get.

## Network

Tests use the **same MSW handlers** as development (`src/mocks`). The database is reset before
each test. Unhandled requests fail the test. Override a handler with `server.use(...)` (see
[Mock backend](mock-backend.md)).

## Guidelines

- Query by **role and accessible name** (`getByRole('button', { name: /save/i })`), not by test
  ids or classes.
- Use `findBy*` for anything asynchronous, and `waitFor` for assertions about disappearance.
- Test behavior, not implementation: no assertions on hook internals or store shapes unless you
  are testing the store itself.
- When you add a feature, add at least one `renderApp` test that opens its route.

## E2E

`playwright.config.ts` starts the dev server with mocking enabled, so no backend is needed.

```bash
npx playwright install chromium   # once
npm run test:e2e
npx playwright test --ui          # interactive runner
```
