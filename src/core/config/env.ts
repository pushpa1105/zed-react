import { z } from 'zod';

/**
 * Typed, validated environment variables.
 *
 * Every variable must be prefixed with `VITE_APP_` in `.env*` files. The
 * prefix is stripped here, so `VITE_APP_API_URL` becomes `env.API_URL`.
 * The app fails fast at startup if a variable is missing or malformed.
 */
const EnvSchema = z.object({
  APP_NAME: z.string().default('zed-react'),
  API_URL: z.string().default('/api'),
  ENABLE_API_MOCKING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  DEFAULT_LOCALE: z.string().default('en'),
});

export type Env = z.infer<typeof EnvSchema>;

function createEnv(): Env {
  const raw = Object.entries(import.meta.env).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (key.startsWith('VITE_APP_')) {
        acc[key.replace('VITE_APP_', '')] = String(value);
      }
      return acc;
    },
    {},
  );

  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return parsed.data;
}

export const env = createEnv();
