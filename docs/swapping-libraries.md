# Swapping libraries

Every third-party library with a real chance of being replaced is used through **one adapter
file**. Features and components import the adapter, never the library. ESLint blocks direct
imports anywhere else:

```
'sonner' import is restricted from being used. Import from "@/core/notify/notify" instead:
each library is wrapped in one adapter so it can be swapped.
```

So replacing a library means **rewriting one file and keeping its exports the same**. No feature
code changes.

## The adapters

| Concern       | Library today          | Adapter (the only file importing it)             | What the app imports                        |
| ------------- | ---------------------- | ------------------------------------------------ | ------------------------------------------- |
| HTTP          | axios                  | `src/core/api/client.ts` (+ `errors.ts`)         | `api.get/post/put/patch/delete`, `ApiError` |
| Routing       | react-router           | `src/core/router/router.ts`                      | `Link`, `useNavigate`, `useSearchParams`…   |
| i18n          | i18next, react-i18next | `src/core/i18n/use-translation.ts` (+ `i18n.ts`) | `useTranslation`, `Trans`, `TFunction`      |
| Toasts        | sonner                 | `src/core/notify/notify.ts`                      | `notify.success/error/info`                 |
| Dates         | dayjs                  | `src/shared/lib/format.ts`                       | `formatDate`, `formatRelative`              |
| Class names   | cn                     | `src/shared/lib/cn.ts`                           | `cn`                                        |
| Error reports | (console)              | `src/core/observability/report-error.ts`         | `reportError`                               |
| Storage       | localStorage           | `src/shared/lib/storage.ts`                      | `storage.get/set/remove`                    |

The list of guarded libraries is the `ADAPTERS` array in [`eslint.config.js`](../eslint.config.js).
Add a library there to protect it the same way.

## Examples

### Replace axios with `fetch`

Rewrite `send()` in `core/api/client.ts`. The exported `api` object and its signatures stay the
same:

```ts
async function send<S extends z.ZodType>(schema: S | undefined, config: RequestConfig) {
  const url = new URL(env.API_URL + config.url, window.location.origin);
  Object.entries(config.params ?? {}).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)));

  const token = storage.get<string>(TOKEN_KEY);
  const response = await fetch(url, {
    method: config.method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: config.data === undefined ? undefined : JSON.stringify(config.data),
  });

  const data = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    const error = new ApiError(data?.message ?? response.statusText, { code: 'http', status: response.status });
    if (error.status === 401) onUnauthorized?.();
    throw error;
  }
  return schema ? schema.parse(data) : (undefined as z.output<S>);
}
```

Then remove the `AxiosError` branch from `toApiError()` in `errors.ts` and uninstall axios.
Features keep calling `api.get('/tasks', schema)`.

### Replace sonner with another toast library

Rewrite the three functions in `core/notify/notify.ts`, then render the new library's container
in `core/theme/components/themed-toaster.tsx` (or in `app/providers.tsx`). Nothing else changes.

You can also send messages somewhere other than a toast (a status bar, analytics) from the same
file.

### Replace dayjs with date-fns or `Intl`

```ts
// shared/lib/format.ts
const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
export const formatDate = (date: number | string | Date) => dateFmt.format(new Date(date));
```

Keep the function names. Call sites pass a format string in one place (`users-page.tsx`), so
adjust that if the new signature differs.

### Replace or upgrade the router

All routing primitives come from `core/router/router.ts`. Point the re-exports at the new
library, or write thin wrappers with the same names. The route tree is built in one file,
`app/routes.tsx`, from the manifests.

### Replace i18next

Re-implement `useTranslation` (return `{ t, i18n }`) in `core/i18n/use-translation.ts` and the
setup in `core/i18n/i18n.ts`. Translation files are plain JSON, so they move as they are.

### Plug in error monitoring

```ts
// core/observability/report-error.ts
import * as Sentry from '@sentry/react';
export function reportError(error: unknown, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}
```

Error boundaries and failed queries/mutations already call `reportError`.

## Libraries that are deliberately not wrapped

| Library                     | Why                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| React, TypeScript, Tailwind | The foundation. Replacing them is a rewrite, not a swap                                                       |
| TanStack Query              | Its API (`useQuery`, `queryOptions`) _is_ the abstraction, and it is confined to each feature's `api/` folder |
| Zod                         | Schemas are data definitions. Hiding them would only add indirection                                          |
| React Hook Form             | Used in forms only. `core/forms/TextField` already hides most of it                                           |
| shadcn/ui + Radix           | The components are **your source code** in `shared/ui`. Change them in place                                  |
| lucide-react                | Icons are leaf imports. Search-and-replace is trivial                                                         |

Wrapping these would add a layer you have to maintain without making a future change cheaper.

## Swapping the UI kit

Components in `shared/ui` are owned source files with a stable, conventional API (`Button`,
`Dialog`, `Select`…). To move to another kit, re-implement those files with the same exports.
Features only import `@/shared/ui/<component>`, so they don't change.
