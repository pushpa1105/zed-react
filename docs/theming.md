# Theming

The theme engine is built on **CSS variables** (shadcn/ui design tokens in OKLCH) and **Tailwind
v4's CSS-first configuration**. There is no `tailwind.config.js`.

## How it works

```
 ThemeCustomizer / ModeToggle / ⌘K ──▶ useThemeStore (Zustand, persisted: "zed-react:theme")
                                              │
                                              ▼  applyTheme()   (core/theme/engine.ts)
 <html class="dark" data-theme="violet" data-font="geist" data-scale="md"
       style="--radius: 0.75rem; --primary: #ff5a1f; --primary-foreground: …">
                                              │
                                              ▼
 styles/globals.css + styles/themes.css ──▶ every utility (bg-primary, rounded-lg, text-sm…)
```

| Option       | Mechanism                                                | Defined in                         |
| ------------ | -------------------------------------------------------- | ---------------------------------- |
| Mode         | `.dark` class on `<html>`                                | `globals.css` (`.dark { … }`)      |
| Color preset | `data-theme` attribute                                   | `themes.css`                       |
| Custom color | inline `--primary` / `--ring` + auto-contrast foreground | `core/theme/engine.ts`             |
| Radius       | inline `--radius`                                        | `globals.css` (`--radius-*` scale) |
| Font         | `data-font` attribute                                    | `themes.css`                       |
| Density      | `data-scale` sets the root `font-size`                   | `themes.css`                       |

**No flash of the wrong theme:** an inline script in `index.html` applies the stored theme before
React loads. `initTheme()` in `main.tsx` then keeps the DOM in sync with the store and with the
OS color scheme.

## Files

| File                     | Role                                                               |
| ------------------------ | ------------------------------------------------------------------ |
| `core/theme/config.ts`   | Registry of modes, presets, fonts, scales, radii, defaults         |
| `core/theme/store.ts`    | Persisted Zustand store                                            |
| `core/theme/engine.ts`   | `applyTheme`, `initTheme`, `useResolvedThemeMode`, `buildThemeCss` |
| `core/theme/components/` | `ModeToggle`, `ThemeSheet`, `ThemeCustomizer`, `ThemedToaster`     |
| `styles/globals.css`     | Base tokens (`:root`, `.dark`) + Tailwind mapping                  |
| `styles/themes.css`      | Presets, fonts, scales                                             |

## Change the default look

Edit `DEFAULT_THEME` in `core/theme/config.ts`:

```ts
export const DEFAULT_THEME = {
  mode: 'system',
  preset: 'blue',
  font: 'geist',
  scale: 'md',
  radius: 0.75,
  customPrimary: null,
};
```

Keep the fallbacks in the `index.html` script in sync (`'neutral'`, `'geist'`, `'md'`).

### Design it live, then export

1. Open the customizer (palette icon) and build the look you want.
2. Click **Copy CSS**. You get the current tokens as a `:root { … }` (or `.dark { … }`) block.
3. Paste it into the matching block in `styles/globals.css`. Repeat in dark mode.

You can also generate palettes with the [shadcn themes page](https://ui.shadcn.com/themes) or
[tweakcn](https://tweakcn.com).

## Add a color preset

1. CSS in `styles/themes.css` (override only what you need):

   ```css
   :root[data-theme='teal'] {
     --primary: oklch(0.6 0.118 184.704);
     --primary-foreground: oklch(0.985 0 0);
     --ring: oklch(0.704 0.14 182.503);
   }
   :root[data-theme='teal'].dark {
     --primary: oklch(0.704 0.14 182.503);
     --primary-foreground: oklch(0.145 0 0);
   }
   ```

2. Register it in `core/theme/config.ts`:

   ```ts
   { value: 'teal', label: 'Teal', swatch: 'oklch(0.6 0.118 184.704)' },
   ```

The customizer is generated from the registry, so the preset appears automatically. Fonts and
scales work the same way.

## Add a design token

```css
/* globals.css */
:root  { --info: oklch(0.6 0.2 240); }
.dark  { --info: oklch(0.7 0.18 240); }

@theme inline {
  --color-info: var(--info); /* enables bg-info, text-info, border-info… */
}
```

`success` and `warning` already exist (used by the task badges).

## Use the theme in code

```tsx
import { useResolvedThemeMode } from '@/core/theme/engine';
import { useThemeStore } from '@/core/theme/store';

const preset = useThemeStore((s) => s.preset);
const setMode = useThemeStore((s) => s.setMode);
const mode = useResolvedThemeMode(); // 'light' | 'dark', with system resolved
```

In markup, prefer **semantic tokens** (`bg-background`, `text-muted-foreground`, `bg-primary`,
`border-border`) over raw colors (`bg-white`, `text-gray-500`). They follow every theme. Use
`dark:` only for rare one-off tweaks.
