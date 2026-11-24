import { http, HttpResponse } from 'msw';

import { env } from '@/core/config/env';

import { networkDelay } from '../utils';

import { authHandlers } from './auth';
import { tasksHandlers } from './tasks';
import { usersHandlers } from './users';

export const handlers = [
  ...authHandlers,
  ...tasksHandlers,
  ...usersHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
