import Axios, { type AxiosRequestConfig } from 'axios';
import type { z } from 'zod';

import { env } from '@/core/config/env';
import { storage } from '@/shared/lib/storage';

import { toApiError } from './errors';

/**
 * The only HTTP client in the app. Features call `api.get/post/...` with a
 * Zod schema; the response is validated at runtime and typed from the schema,
 * so a backend change that breaks the contract fails loudly in one place
 * instead of crashing a component three screens later.
 *
 *   const task = await api.get(`/tasks/${id}`, taskSchema); // typed as Task
 */

export const TOKEN_KEY = 'token';

/** Called when the server says the session is no longer valid (HTTP 401). */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

const http = Axios.create({
  baseURL: env.API_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
  // Send cookies too, in case your backend uses httpOnly session cookies.
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = storage.get<string>(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(undefined, (error: unknown) => {
  const apiError = toApiError(error);
  if (apiError.status === 401) {
    storage.remove(TOKEN_KEY);
    onUnauthorized?.();
  }
  return Promise.reject(apiError);
});

async function send<S extends z.ZodType>(
  schema: S | undefined,
  config: AxiosRequestConfig,
): Promise<z.output<S>> {
  const response = await http.request<unknown>(config);
  if (!schema) return undefined as z.output<S>;
  try {
    return schema.parse(response.data);
  } catch (error) {
    throw toApiError(error, config.url);
  }
}

type Config = Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;

export const api = {
  get: <S extends z.ZodType>(url: string, schema: S, config?: Config) =>
    send(schema, { ...config, url, method: 'GET' }),

  post: <S extends z.ZodType>(url: string, data: unknown, schema?: S, config?: Config) =>
    send(schema, { ...config, url, data, method: 'POST' }),

  put: <S extends z.ZodType>(url: string, data: unknown, schema?: S, config?: Config) =>
    send(schema, { ...config, url, data, method: 'PUT' }),

  patch: <S extends z.ZodType>(url: string, data: unknown, schema?: S, config?: Config) =>
    send(schema, { ...config, url, data, method: 'PATCH' }),

  delete: <S extends z.ZodType>(url: string, schema?: S, config?: Config) =>
    send(schema, { ...config, url, method: 'DELETE' }),
};
