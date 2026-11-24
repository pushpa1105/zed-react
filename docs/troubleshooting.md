# Troubleshooting

### ESLint says an import is restricted

That is the architecture working:

| Message contains                      | Fix                                                                |
| ------------------------------------- | ------------------------------------------------------------------ |
| `Features must not import each other` | Move the shared code to `core/` or `shared/`, or compose in `app/` |
| `core/ is feature-agnostic`           | Pass the data in as a prop, or move the code up into a feature/app |
| `Import a feature's manifest … only`  | Expose it through the manifest, or move the code to `core`         |
| `Import from "@/core/…" instead`      | Use the adapter (see [Swapping libraries](swapping-libraries.md))  |
| `Use the "@/..." alias`               | Replace `../../x` with `@/…`                                       |

### "Unexpected response from /…" (`ApiError` with `code: 'contract'`)

The server's response doesn't match the Zod schema. Log `error.details` to see the exact issues,
then fix the schema (or the server).

### `t('…')` shows a type error

The key doesn't exist in the English file, or the namespace isn't registered in
`src/app/i18n-resources.d.ts`. Restart the TS server after adding a JSON file.

### The translation test fails

A key exists in one language but not in another. The diff in the test output shows which.

### A new feature doesn't show up

- Is it in the `modules` array in `src/app/modules.ts`?
- Does its `nav.to` match a route? (`validateModules` warns in the dev console.)
- Role-restricted? Sign in as `demo@example.com` (admin).

### Requests hit the real network or return HTML

Mocking is off, or there is no handler for that URL. Check `VITE_APP_ENABLE_API_MOCKING` and add
the handler to `src/mocks/handlers/index.ts`. In tests, an unhandled request fails loudly on
purpose.

### "Invalid hook call" / two copies of React in dev

Stop the dev server, delete `node_modules/.vite`, start again. `vite.config.ts` already dedupes
React and pre-bundles dependencies up front to prevent this.

### The mock database looks stale

Clear `localStorage['zed-react:mock-db']` (DevTools → Application → Local Storage) and reload.

### Theme flashes on load

Make sure the inline script in `index.html` reads the same storage key as `THEME_STORAGE_KEY`
(`zed-react:theme`) and uses the same defaults as `DEFAULT_THEME`.

### Git hooks don't run

Hooks are installed by `npm install` only inside a Git repository: `git init && npm install`.
