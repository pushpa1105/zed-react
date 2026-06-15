# Zed React

A Notion-inspired workspace app prototype built with React, TypeScript, Vite, and Editor.js.

## Overview

This project is a starting point for building a Notion-like productivity application. It includes:

- workspace creation and management
- authentication flow with protected guest routes
- a sidebar-first layout
- block-style rich text editing using Editor.js
- modern UI primitives with Tailwind and Radix

## Features

- `Auth`: login, register, guest access, and protected pages
- `Workspace`: create and select workspaces for personal or team use
- `Editor`: rich content editor with headers, paragraphs, lists, quotes, and code blocks
- `Layout`: responsive sidebar, breadcrumb navigation, and dashboard-style content area
- `State`: Redux Toolkit, React context, and form handling with `@tanstack/react-form`

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Radix UI (within Shadcn)
- Editor.js
- React Router DOM
- Redux Toolkit
- Zod

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open the app at `http://localhost:5173`.

## Available scripts

- `npm run dev` — start the Vite development server
- `npm run build` — build the app for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint checks
- `npm run format` — format files with Prettier
- `npm run format:check` — check formatting

## Project structure

- `src/App.tsx` — application routes and layout composition
- `src/main.tsx` — entry point with store and providers
- `src/pages` — route pages for demo, auth, workspace creation, and fallback
- `src/components` — reusable UI components and editor integration
- `src/context` — auth, workspace, and loader providers
- `src/lib` — route guards, store setup, and utilities
- `src/services` — API/service calls for auth and workspace management
- `src/schemas` — validation schemas with Zod
- `src/hooks` — shared hooks for auth, workspace, and loader state

## Notes

- The `Demo` page currently provides a placeholder dashboard layout.
- The editor is implemented in `src/components/editor/DefaultEditor.tsx` using Editor.js.
- Workspace creation is handled in `src/pages/workspaces/create/index.tsx`.
- Protected routing is managed by `src/lib/auth/ProtectedRoute.tsx` and `src/lib/auth/GuestRoute.tsx`.

## Next improvements

Possible next steps for the Notion-like experience:

- add document/page creation and navigation
- save editor content to backend or local storage
- improve editor toolset and toolbar controls
- add workspace/team collaboration features
- add drag-and-drop page and block ordering

---

Built as a minimal React/TypeScript app for a Notion-style content workspace.
