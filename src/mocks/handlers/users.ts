import { http, HttpResponse } from 'msw';

import { env } from '@/core/config/env';

import { db, persistDb, type DbUser } from '../db';
import { errorResponse, networkDelay, requireAuth, sanitizeUser } from '../utils';

type ProfileBody = Pick<DbUser, 'firstName' | 'lastName' | 'bio'>;

export const usersHandlers = [
  http.patch<never, ProfileBody>(`${env.API_URL}/users/me`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;

    const { firstName, lastName, bio } = await request.json();
    Object.assign(auth.user, { firstName, lastName, bio });
    persistDb();
    return HttpResponse.json(sanitizeUser(auth.user));
  }),

  http.get(`${env.API_URL}/stats`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;

    const count = (status: string) => db.tasks.filter((t) => t.status === status).length;
    return HttpResponse.json({
      total: db.tasks.length,
      todo: count('todo'),
      inProgress: count('in_progress'),
      done: count('done'),
    });
  }),
];

/** Admin-only list of users (used by the `users` feature). */
usersHandlers.push(
  http.get(`${env.API_URL}/users`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;
    if (auth.user.role !== 'ADMIN') return errorResponse('Forbidden', 403);
    return HttpResponse.json(db.users.map(sanitizeUser));
  }),
);
