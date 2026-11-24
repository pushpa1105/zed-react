import { env } from './env';

/** Static, app-wide metadata. Edit this file to rebrand the app. */
export const siteConfig = {
  name: env.APP_NAME,
  description:
    'A modular React starter: feature modules, Tailwind CSS v4, shadcn/ui and a live theme engine.',
  links: {
    repository: 'https://github.com/',
    docs: 'https://ui.shadcn.com',
  },
} as const;
