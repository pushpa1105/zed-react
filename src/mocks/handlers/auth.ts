import { http, HttpResponse } from 'msw';

import { env } from '@/core/config/env';

import { db, persistDb, uid, type DbUser } from '../db';
import { encodeToken, errorResponse, networkDelay, requireAuth, sanitizeUser } from '../utils';

type LoginBody = { email: string; password: string };
type RegisterBody = LoginBody & { firstName: string; lastName: string };

export const authHandlers = [
  http.post<never, LoginBody>(`${env.API_URL}/auth/login`, async ({ request }) => {
    await networkDelay();
    const { email, password } = await request.json();
    const user = db.users.find((u) => u.email === email.toLowerCase());

    if (!user || user.password !== password) {
      return errorResponse('Invalid email or password', 400);
    }
    return HttpResponse.json({ jwt: encodeToken(user.id), user: sanitizeUser(user) });
  }),

  http.post<never, RegisterBody>(`${env.API_URL}/auth/register`, async ({ request }) => {
    await networkDelay();
    const body = await request.json();
    const email = body.email.toLowerCase();

    if (db.users.some((u) => u.email === email)) {
      return errorResponse('A user with this email already exists', 400);
    }

    const user: DbUser = {
      id: uid(),
      createdAt: Date.now(),
      firstName: body.firstName,
      lastName: body.lastName,
      email,
      password: body.password,
      role: 'USER',
      bio: '',
    };
    db.users.push(user);
    persistDb();
    return HttpResponse.json({ jwt: encodeToken(user.id), user: sanitizeUser(user) });
  }),

  http.get(`${env.API_URL}/auth/me`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;
    return HttpResponse.json(sanitizeUser(auth.user));
  }),

  http.post(`${env.API_URL}/auth/logout`, async () => {
    await networkDelay();
    return HttpResponse.json({ message: 'Logged out' });
  }),
];
