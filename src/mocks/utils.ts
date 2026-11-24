import { delay, HttpResponse } from 'msw';

import { db, type DbUser } from './db';

/** Simulated latency (disabled in tests). */
export const networkDelay = () => delay(import.meta.env.MODE === 'test' ? 0 : 400);

/** Fake JWT: base64 encoded user id. NEVER do this in a real backend. */
export const encodeToken = (userId: string) => btoa(JSON.stringify({ sub: userId }));

const decodeToken = (token: string): string | null => {
  try {
    return (JSON.parse(atob(token)) as { sub: string }).sub;
  } catch {
    return null;
  }
};

export const sanitizeUser = ({ password: _password, ...user }: DbUser) => user;

export const errorResponse = (message: string, status: number) =>
  HttpResponse.json({ message }, { status });

/** Returns the authenticated user or a 401 response. */
export function requireAuth(request: Request): { user: DbUser } | { error: Response } {
  const header = request.headers.get('Authorization');
  const token = header?.replace('Bearer ', '');
  const userId = token ? decodeToken(token) : null;
  const user = userId ? db.users.find((u) => u.id === userId) : undefined;

  if (!user) return { error: errorResponse('Unauthorized', 401) };
  return { user };
}
