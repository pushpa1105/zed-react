# Zed React

Zed React is a Notion-inspired workspace application built with React, TypeScript, and Vite. It combines authenticated workspaces, a responsive workspace layout, and block-based document editing.

## Features

- Login and registration flows with guest and protected route guards
- Workspace loading, selection, and workspace creation
- Responsive dashboard and workspace layouts
- BlockNote editor with block persistence and debounced updates
- Drag-and-drop support for sortable content
- Shared UI components built with Radix primitives and Tailwind CSS
- Client state managed with Redux Toolkit and React context

## Tech stack

- React 19 and TypeScript
- Vite 7
- React Router DOM 7
- BlockNote
- Redux Toolkit and React Redux
- Tailwind CSS 4 and Radix UI
- Zod and TanStack Form
- Axios

## Requirements

- Node.js 18 or newer
- npm
- Access to the backend API used by the application

## Getting started

Install dependencies, then start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

The app starts at the protected dashboard route. Use `/login` or `/register` to authenticate, then create a workspace at `/workspaces/create` if your account does not have one yet.

## Available scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the Vite development server       |
| `npm run build`        | Type-check and build for production     |
| `npm run preview`      | Preview the production build locally    |
| `npm run typecheck`    | Run TypeScript without emitting files   |
| `npm run lint`         | Run ESLint                              |
| `npm run lint:fix`     | Fix automatically fixable ESLint issues |
| `npm run format`       | Format the repository with Prettier     |
| `npm run format:check` | Check formatting without changing files |

## Project structure

```text
src/
├── app/                  # Redux store and dashboard data
├── features/
│   ├── auth/             # Authentication API, context, guards, and pages
│   ├── dashboard/        # Dashboard page
│   ├── pana/             # Document editor, block API, state, and utilities
│   ├── user/              # User API
│   └── workspaces/        # Workspace API, context, and pages
└── shared/
	├── components/       # Reusable editor, form, loader, and UI components
	├── constants/         # Route and application constants
	├── context/           # Shared providers
	├── layouts/           # Main and workspace layouts
	├── lib/               # Shared libraries and API helpers
	└── utils/             # Shared utility functions and hooks
```

The `@` import alias points to `src`, and is configured in `vite.config.ts` and the TypeScript configuration.

## Routing

- `/login` — sign in
- `/register` — create an account
- `/` — authenticated dashboard
- `/workspaces/create` — create a workspace
- `/:id` — authenticated Pana document editor

Authentication and workspace data are provided at the application root. API calls live alongside their feature under `src/features/*/api`.

## Development notes

- Editor changes are synchronized through the Pana block API after a short debounce.
- Route definitions are centralized in `src/shared/constants/routes.ts`.
- Run `npm run typecheck`, `npm run lint`, and `npm run format:check` before opening a pull request.
