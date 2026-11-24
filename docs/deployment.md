# Deployment

The production build is a **static SPA** in `dist/`. Any static host works, as long as unknown
paths fall back to `index.html` (client-side routing).

```bash
npm run build     # typecheck + build
npm run preview   # serve dist/ on http://localhost:4173
```

The build splits vendor code into long-term-cacheable chunks (`react`, `query`, `radix`) and
gives every page its own chunk.

## Environment variables

Variables must start with `VITE_APP_`. They are validated by Zod at startup
(`src/core/config/env.ts`), and the app refuses to boot with invalid config.

| Variable                      | Default     | Description                |
| ----------------------------- | ----------- | -------------------------- |
| `VITE_APP_NAME`               | `zed-react` | Display name               |
| `VITE_APP_API_URL`            | `/api`      | Backend base URL           |
| `VITE_APP_ENABLE_API_MOCKING` | `false`     | Serve the MSW fake backend |
| `VITE_APP_DEFAULT_LOCALE`     | `en`        | Fallback language          |

> Vite inlines these at **build time**, and they are public. Never put secrets in them.

To add a variable: add it to `EnvSchema` in `src/core/config/env.ts`, to `src/vite-env.d.ts` and
to `.env.example`.

**Production checklist:** set `VITE_APP_ENABLE_API_MOCKING=false` (or leave it unset), and set
`VITE_APP_API_URL` to your backend.

## Docker

```bash
docker build -t zed-react --build-arg VITE_APP_API_URL=https://api.example.com .
docker run -p 8080:80 zed-react       # http://localhost:8080
```

The multi-stage `Dockerfile` builds with Node and serves `dist/` with nginx. `nginx.conf` includes
the SPA fallback, long-term caching for hashed assets, gzip, basic security headers and a
commented-out `/api` reverse proxy.

To ship a **demo without a backend**, build with `--build-arg VITE_APP_ENABLE_API_MOCKING=true`.

## Static hosts

| Host       | Settings                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| Vercel     | Framework: Vite. Add a rewrite `/(.*) → /index.html`                            |
| Netlify    | Build `npm run build`, publish `dist`, add `/* /index.html 200` to `_redirects` |
| Cloudflare | Build `npm run build`, output `dist` (SPA fallback is automatic)                |

## CI

`.github/workflows/ci.yml` runs on every push to `main` and on every PR:

1. **quality:** typecheck → lint → format check → tests with coverage → build
2. **e2e:** Playwright against the dev server (mock backend). The report is uploaded as an
   artifact.

## Monitoring

Wire your error tracker into `src/core/observability/report-error.ts`. Error boundaries and
failed queries/mutations (non-4xx) already report there.
