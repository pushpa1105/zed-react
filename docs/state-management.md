# State management

Choose the **smallest scope** that works. Most state is not global.

| Kind of state             | Where it lives                                 | Example                             |
| ------------------------- | ---------------------------------------------- | ----------------------------------- |
| Server data               | **TanStack Query** cache                       | tasks, session user, stats          |
| Shareable UI state        | **URL** (`useSearchParams`, parsed with Zod)   | filters, page, active tab, `?new=1` |
| Form state                | **React Hook Form**                            | task form, profile form             |
| Local UI state            | `useState` / `useDisclosure`                   | a dialog's open state               |
| App-wide client state     | **Zustand** store in `core/<concern>/store.ts` | theme preferences                   |
| Feature-only client state | Zustand store in `features/<name>/stores/`     | a multi-step wizard draft           |

## Rules of thumb

- **Never copy server data into `useState` or Zustand.** Read it from the query cache, which
  handles caching, refetching and invalidation.
- If a value should survive a reload or be shareable by link, put it in the **URL**. Parse it
  with a schema (`.catch()` defaults) so a bad URL can't crash the page. See
  `features/tasks/model/task.ts` → `taskFiltersSchema`.
- Reach for a global store only when unrelated components need the same non-server value.
- Select narrowly from stores to avoid re-renders:

  ```ts
  const mode = useThemeStore((s) => s.mode); // ✅ re-renders only when mode changes
  const theme = useThemeStore();             // ⚠️ re-renders on any change
  ```

## Creating a store

```ts
// src/features/onboarding/stores/wizard-store.ts
import { create } from 'zustand';

type WizardState = {
  step: number;
  next: () => void;
  reset: () => void;
};

export const useWizardStore = create<WizardState>()((set) => ({
  step: 0,
  next: () => set((s) => ({ step: s.step + 1 })),
  reset: () => set({ step: 0 }),
}));
```

Add `persist` middleware (see `core/theme/store.ts`) to keep it in `localStorage`. Version it
(`version: 1`) so you can migrate the stored shape later.
