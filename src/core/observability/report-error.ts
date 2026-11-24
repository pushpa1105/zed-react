/**
 * Single funnel for unexpected errors (error boundaries, failed queries and
 * mutations). Plug your monitoring tool in here, for example:
 *
 *   import * as Sentry from '@sentry/react';
 *   Sentry.captureException(error, { extra: context });
 *
 * Expected failures (validation, 4xx) should not be reported.
 */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (import.meta.env.MODE === 'test') return;
  console.error('[reportError]', error, context);
}
