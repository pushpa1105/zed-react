# Mock backend

[MSW](https://mswjs.io) intercepts network requests and answers them from a small fake database,
so the app and its tests run without a server.

```
src/mocks/
├── db.ts            seed data + in-memory database (persisted to localStorage in the browser)
├── utils.ts         latency, fake tokens, requireAuth(), errorResponse()
├── handlers/        one file per resource: auth, tasks, users (+ generated ones)
│   └── index.ts     combines them
├── browser.ts       startMockBackend() for development
└── server.ts        Node server for Vitest
```

The mock layer stands in for a real server, so **it must not import app code**. Lint enforces
this. It only reads `core/config/env`.

## When it runs

| Context       | How                                                                 |
| ------------- | ------------------------------------------------------------------- |
| `npm run dev` | When `VITE_APP_ENABLE_API_MOCKING=true` (`main.tsx`)                |
| Vitest        | Always (`testing/setup-tests.ts`). The DB is reset before each test |
| Playwright    | The dev server runs with mocking enabled                            |

In tests, an unhandled request **fails the test** (`onUnhandledFrame: 'error'`), so nothing can
reach the real network by accident.

## Seed data

`db.ts` seeds an admin (`demo@example.com`), a member (`member@example.com`), both with password
`password`, and 12 tasks. In the browser the DB persists under `localStorage['zed-react:mock-db']`.
Clear it to reseed.

## Adding an endpoint

```ts
// src/mocks/handlers/projects.ts
export const projectsHandlers = [
  http.get(`${env.API_URL}/projects`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;
    return HttpResponse.json({ data: db.projects, meta: { page: 1, total: db.projects.length, totalPages: 1 } });
  }),
];
```

Then add it to `handlers/index.ts`. To persist new collections, extend the `Database` type and
`seed()` in `db.ts` and call `persistDb()` after writes.

Mirror your server's real rules (auth, roles, validation, status codes) so the UI is tested
against realistic behavior. The tasks handlers return 403 when a member edits someone else's task.

## Overriding a handler in one test

```ts
server.use(http.get(`${env.API_URL}/tasks`, () => HttpResponse.json({ message: 'Boom' }, { status: 500 })));
```

## Connecting a real backend

1. Set in `.env`:

   ```
   VITE_APP_ENABLE_API_MOCKING=false
   VITE_APP_API_URL=https://api.example.com   # or /api behind a proxy
   ```

2. Match the contract. Response shapes are the Zod schemas in each feature's `model/`. If your
   API differs, adapt the **schema** (for example with `.transform()`), not the components.
3. Auth: the client sends `Authorization: Bearer <token>` and also `withCredentials: true`.
   - **Cookie sessions:** remove the token lines in `core/api/client.ts` and
     `core/auth/session.ts`.
   - **Different login response:** update `authResponseSchema` in `core/auth/session.ts`.
4. Errors: the client reads `{ message }` from error bodies. Change `toApiError()` in
   `core/api/errors.ts` if your API uses another shape.
5. CORS: either enable it on the API, or proxy `/api` in development:

   ```ts
   // vite.config.ts
   server: { port: 3000, proxy: { '/api': 'http://localhost:8080' } },
   ```

   In production, `nginx.conf` contains a commented-out `/api` proxy block.

Keep the mocks for tests even after you have a real backend. They make tests fast and
deterministic.
