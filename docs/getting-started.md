# Getting started

## Requirements

- **Node.js 20.19+** (`.nvmrc` pins 24. Run `nvm use` if you use nvm.)
- npm (comes with Node)
- Optional: Docker for container builds

## 1. Install

```bash
npm install
cp .env.example .env
```

`npm install` also installs the Git hooks (Husky) if the folder is a Git repository. If you
created the repo afterwards, run `git init && npm install` again.

## 2. Configure

All configuration lives in `.env`. Only variables starting with `VITE_APP_` are read, and they are
validated at startup by [`src/core/config/env.ts`](../src/core/config/env.ts), so a typo fails
fast with a clear message.

| Variable                      | Default     | Meaning                                                     |
| ----------------------------- | ----------- | ----------------------------------------------------------- |
| `VITE_APP_NAME`               | `zed-react` | Name shown in the logo and page titles                      |
| `VITE_APP_API_URL`            | `/api`      | Base URL of your backend                                    |
| `VITE_APP_ENABLE_API_MOCKING` | `false`     | `true` serves the built-in fake backend instead of a server |
| `VITE_APP_DEFAULT_LOCALE`     | `en`        | Fallback language                                           |

`.env.example` turns mocking on, so the app works immediately.

## 3. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

| Account              | Password   | Role                                     |
| -------------------- | ---------- | ---------------------------------------- |
| `demo@example.com`   | `password` | Admin: sees the **Users** page           |
| `member@example.com` | `password` | Member: cannot edit other people's tasks |

The fake database is stored in `localStorage` (`zed-react:mock-db`). Clear site data to reset it.

## 4. Take the tour (5 minutes)

1. **Landing page → Get started → Sign in.** Try a wrong password to see server errors shown in
   the form.
2. **Dashboard.** Stats come from `/api/stats`, prefetched while the page code loads.
3. **Tasks.**
   - Search, filter by status and page through the list. All of it lives in the URL, so try reloading.
   - Create, edit and delete tasks. Sign in as the member and the edit/delete buttons disappear
     on tasks they don't own.
4. **Press `Ctrl K` (or `⌘K`).** This is the command palette. Type "create" and press Enter.
5. **Palette icon in the header.**
   - Change mode, color, radius, font and density.
   - Pick any brand color. Reload: there is no flash.
   - Use **Copy CSS** to make your look the default.
6. **Language icon.** Switch to Español. Every feature ships its own translations.
7. **Users** (admin only). Then sign in as the member and open `/app/users`: access is denied.

## 5. Read the code in this order

1. [`src/app/modules.ts`](../src/app/modules.ts): the list of features.
2. [`src/features/tasks/index.ts`](../src/features/tasks/index.ts): a feature manifest.
3. [`src/features/tasks/`](../src/features/tasks): model → api → components → pages.
4. [`src/app/routes.tsx`](../src/app/routes.tsx): how manifests become routes.
5. [`src/core/`](../src/core): infrastructure, one folder per concern.

Then follow the [tutorial](adding-a-feature.md) to build your own feature.

## 6. Make it yours

| Task                        | Where                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| Rename the app              | `VITE_APP_NAME` in `.env`, `<title>` in `index.html`                                                |
| Change the logo             | `src/app/shell/logo.tsx`, `public/favicon.svg`                                                      |
| Change the default theme    | `DEFAULT_THEME` in `src/core/theme/config.ts` ([guide](theming.md))                                 |
| Change the landing page     | `src/app/pages/landing-page.tsx`                                                                    |
| Remove the example features | Delete the folder + its line in `src/app/modules.ts` ([how](feature-modules.md#removing-a-feature)) |
| Connect your backend        | [Mock backend → connecting a real API](mock-backend.md#connecting-a-real-backend)                   |

## Everyday commands

```bash
npm run generate        # new feature or component
npm test                # tests in watch mode
npm run check           # everything CI checks, before you open a PR
```
