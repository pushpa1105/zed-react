import { http, HttpResponse } from 'msw';
import { z } from 'zod';

import { env } from '@/core/config/env';
import { server } from '@/mocks/server';

import { api } from '../client';
import { ApiError } from '../errors';

const thingSchema = z.object({ id: z.string(), count: z.number() });

describe('api client', () => {
  it('returns data validated and typed by the schema', async () => {
    server.use(http.get(`${env.API_URL}/thing`, () => HttpResponse.json({ id: 'a', count: 1 })));
    await expect(api.get('/thing', thingSchema)).resolves.toEqual({ id: 'a', count: 1 });
  });

  it('turns a response that breaks the contract into an ApiError', async () => {
    server.use(http.get(`${env.API_URL}/thing`, () => HttpResponse.json({ id: 'a' })));
    const error = await api.get('/thing', thingSchema).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'contract' });
  });

  it('normalizes HTTP errors with the server message and status', async () => {
    server.use(
      http.get(`${env.API_URL}/thing`, () =>
        HttpResponse.json({ message: 'Nope' }, { status: 403 }),
      ),
    );
    const error = await api.get('/thing', thingSchema).catch((e: unknown) => e);

    expect(error).toMatchObject({
      code: 'http',
      status: 403,
      message: 'Nope',
      isClientError: true,
    });
  });
});
