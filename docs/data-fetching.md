# Data fetching

```
component ─ useTasks(filters) ─▶ tasksQuery(filters) ─▶ tasksApi.list() ─▶ api.get(url, schema)
           (TanStack Query)       (queryOptions)          (plain request)    (core adapter + Zod)
```

## 1. The API client

[`core/api/client.ts`](../src/core/api/client.ts) is the only HTTP client. It handles the base
URL, auth header, cookies, timeout and 401s, and it **validates every response**:

```ts
api.get(url, schema, config?)            // → z.output<schema>
api.post(url, body, schema?, config?)
api.put / api.patch(url, body, schema?, config?)
api.delete(url, schema?, config?)
```

```ts
const task = await api.get(`/tasks/${id}`, taskSchema); // typed as Task, checked at runtime
```

Shared schemas live in [`core/api/schemas.ts`](../src/core/api/schemas.ts): `entitySchema`
(`id`, `createdAt`), `paginated(item)` and `paginationMetaSchema`.

## 2. Errors: one shape

Everything thrown by the API layer is an `ApiError`:

| Field           | Meaning                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `message`       | Server `message` if present, otherwise a readable fallback             |
| `status`        | HTTP status or `null`                                                  |
| `code`          | `'http'` · `'network'` · `'contract'` (the response failed the schema) |
| `isClientError` | `true` for 4xx                                                         |
| `details`       | Server body or Zod issues                                              |

Use `getErrorMessage(error)` in UI. TanStack Query's error type is registered as `ApiError`, so
`query.error.status` is typed.

## 3. Requests, keys and query options

Each feature keeps them in `api/`:

```ts
// tasks-api.ts: plain functions, no React
export const tasksApi = {
  list: (filters: TaskFilters) => api.get('/tasks', paginated(taskSchema), { params: filters }),
  get: (id: string) => api.get(`/tasks/${id}`, taskSchema),
};

// tasks-queries.ts
export const tasksKeys = {
  all: ['tasks'] as const,
  lists: () => [...tasksKeys.all, 'list'] as const,
  list: (f: TaskFilters) => [...tasksKeys.lists(), f] as const,
  detail: (id: string) => [...tasksKeys.all, 'detail', id] as const,
};

export const tasksQuery = (filters: TaskFilters) =>
  queryOptions({ queryKey: tasksKeys.list(filters), queryFn: () => tasksApi.list(filters) });

export const useTasks = (filters: TaskFilters) => useQuery(tasksQuery(filters));
```

`queryOptions` objects are reused by hooks, loaders (`prefetchQuery`) and tests, with no
duplication.

## 4. Mutations with `meta`

The global `MutationCache` in [`core/query/query-client.ts`](../src/core/query/query-client.ts)
reads `meta`, so hooks stay small:

```ts
export function useCreateTask(options?: MutationOptions<Task, TaskInput>) {
  const { t } = useTranslation('tasks');
  return useMutation({
    mutationFn: tasksApi.create,
    ...options,
    meta: { invalidates: [tasksKeys.lists()], successMessage: t('toast.created'), ...options?.meta },
  });
}
```

| `meta` key       | Effect                                                            |
| ---------------- | ----------------------------------------------------------------- |
| `invalidates`    | Query keys refetched after success                                |
| `successMessage` | Success toast                                                     |
| `errorMessage`   | Error toast title. `false` disables it (forms show inline errors) |

Callers add behavior through `options`:
`useCreateTask({ onSuccess: () => setOpen(false) })`.

For queries, `meta: { errorToast: true }` shows a toast on failure. By default, render the error
inline.

## 5. Defaults

| Setting                | Value                                              |
| ---------------------- | -------------------------------------------------- |
| `staleTime`            | 60 s                                               |
| `refetchOnWindowFocus` | off                                                |
| `retry`                | 2 for network/5xx; none for 4xx or contract errors |
| Error reporting        | Non-4xx errors go to `reportError()`               |

## 6. Patterns

- **Pagination:** `placeholderData: keepPreviousData` keeps the old page on screen while the
  next one loads.
- **Optimistic detail update:** `useUpdateTask` writes the returned task into the detail cache
  with `setQueryData`.
- **Cross-feature freshness:** the dashboard can't know about task mutations, so its stats query
  uses `staleTime: 0` and refetches on mount.

## 7. Real backend

Set `VITE_APP_ENABLE_API_MOCKING=false` and `VITE_APP_API_URL`. See
[Mock backend](mock-backend.md#connecting-a-real-backend).
